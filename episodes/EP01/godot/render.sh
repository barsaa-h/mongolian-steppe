#!/usr/bin/env bash
# Manager-side GPU runner. Every job is isolated so one failure cannot skip the rest.
set -u
set -o pipefail
PROJECT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
export XDG_CONFIG_HOME="$PROJECT/.godot-home/config"
export XDG_DATA_HOME="$PROJECT/.godot-home/data"
export XDG_CACHE_HOME="$PROJECT/.godot-home/cache"
mkdir -p "$XDG_CONFIG_HOME" "$XDG_DATA_HOME" "$XDG_CACHE_HOME" "$PROJECT/out" "$PROJECT/compare/logs"
GODOT=${GODOT:-/home/barsaa/.local/bin/godot}
TIMINGS="$PROJECT/compare/timings.txt"
printf 'step\tseconds\texit_code\tframes\teffective_fps\n' > "$TIMINGS"
failures=0

run_step() {
    local label=$1 frames=$2 status seconds fps
    shift 2
    printf 'Running %s\n' "$label"
    /usr/bin/time -f '%e' -o "$PROJECT/compare/logs/$label.seconds" \
        "$@" > "$PROJECT/compare/logs/$label.log" 2>&1
    status=$?
    seconds=$(tail -n 1 "$PROJECT/compare/logs/$label.seconds")
    fps=$(python3 -c 'import sys; s=float(sys.argv[1]); n=int(sys.argv[2]); print(f"{n/s:.3f}" if n and s and sys.argv[3]=="0" else "-")' "$seconds" "$frames" "$status")
    printf '%s\t%s\t%s\t%s\t%s\n' "$label" "$seconds" "$status" "$frames" "$fps" >> "$TIMINGS"
    printf '%s: exit=%s wall=%ss fps=%s\n' "$label" "$status" "$seconds" "$fps"
    if (( status != 0 )); then
        failures=$((failures + 1))
    fi
    return "$status"
}

run_step prepare 0 python3 "$PROJECT/tools/prepare_assets.py"
run_step import 0 timeout 300 "$GODOT" --headless --path "$PROJECT" --import
run_step build 0 timeout 120 "$GODOT" --headless --path "$PROJECT" --script res://tools/build_scene.gd
run_step validate 0 timeout 120 "$GODOT" --headless --path "$PROJECT" --script res://tools/validate_scene.gd -- --validate

for cam in S001 S004; do
    png="$PROJECT/compare/B23_${cam}_godot.png"
    rm -f -- "$png"
    run_step "still_$cam" 1 timeout 180 "$GODOT" --path "$PROJECT" \
        --rendering-method forward_plus --rendering-driver vulkan --audio-driver Dummy \
        --resolution 1920x1080 --disable-vsync --fixed-fps 24 \
        res://scenes/B23_S001.tscn -- "--cam=$cam" --still=4.0 "--output=$png"
    run_step "verify_still_$cam" 0 python3 "$PROJECT/tools/verify_outputs.py" "$png" 1920 1080
done

render_clip() {
    local label=$1 width=$2 height=$3 method=$4 driver=$5 filename=$6
    local avi="$PROJECT/out/$label.avi" mp4="$PROJECT/compare/$filename"
    rm -f -- "$avi" "$mp4"
    if run_step "$label" 192 timeout 900 "$GODOT" --path "$PROJECT" \
        --rendering-method "$method" --rendering-driver "$driver" --audio-driver Dummy \
        --resolution "${width}x${height}" --disable-vsync --write-movie "$avi" \
        --fixed-fps 24 --quit-after 192 res://scenes/B23_S001.tscn -- --cam=S001; then
        run_step "encode_$label" 0 ffmpeg -hide_banner -loglevel warning -y -i "$avi" \
            -map 0:v:0 -an -frames:v 192 -r 24 -c:v libx264 -preset medium -crf 18 \
            -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
            -movflags +faststart "$mp4"
        run_step "verify_$label" 0 python3 "$PROJECT/tools/verify_outputs.py" "$mp4" "$width" "$height"
    else
        printf 'Render failed; encode skipped. See %s.log\n' "$label" > "$PROJECT/compare/logs/encode_$label.log"
        printf 'encode_%s\t0\tskipped\t0\t-\n' "$label" >> "$TIMINGS"
    fi
}

render_clip forward_1080p 1920 1080 forward_plus vulkan B23_S001_godot.mp4
render_clip forward_540p 960 540 forward_plus vulkan B23_S001_godot_540p.mp4
render_clip mobile_540p 960 540 mobile vulkan B23_S001_godot_540p_mobile.mp4
render_clip opengl3_540p 960 540 gl_compatibility opengl3 B23_S001_godot_540p_opengl3.mp4
run_step comparison 0 python3 "$PROJECT/tools/compare.py"
printf 'Finished: %s failed steps. Timings: %s\n' "$failures" "$TIMINGS"
# Leave raw AVI files for diagnosis; out/ is ignored.
(( failures == 0 ))
