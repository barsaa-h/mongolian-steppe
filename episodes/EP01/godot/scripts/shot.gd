extends Node3D

const FPS := 24
const FRAME_COUNT := 192
var frame_index := 0
var still_time := -1.0
var still_output := ""
var camera_name := "S001"
var capture_pending := false
var validate_only := false
@onready var player: AnimationPlayer = $Performance

func _ready() -> void:
	for arg in OS.get_cmdline_user_args():
		if arg.begins_with("--cam="):
			camera_name = arg.get_slice("=", 1)
		elif arg.begins_with("--still="):
			var value := arg.get_slice("=", 1)
			if not value.is_valid_float() or float(value) < 0.0 or float(value) > 8.0:
				fail("Still time must be between 0 and 8 seconds")
				return
			still_time = float(value)
		elif arg.begins_with("--output="):
			still_output = arg.trim_prefix("--output=")
		elif arg == "--validate":
			validate_only = true
	if camera_name not in ["S001", "S004"]:
		fail("Unknown camera: " + camera_name)
		return
	if still_output.is_empty():
		still_output = "res://compare/B23_%s_godot.png" % camera_name
	get_node("Cameras/CAM_B23_" + camera_name).make_current()
	player.play("B23_Mitten_Offer")
	player.pause()
	sample_pose(maxf(still_time, 0.0))
	print("SHOT camera=%s still=%s renderer=%s viewport=%s" % [camera_name, still_time, RenderingServer.get_current_rendering_method(), get_viewport().get_visible_rect().size])
	if validate_only:
		set_process(false)
	elif still_time >= 0.0 and DisplayServer.get_name() == "headless":
		fail("Still capture requires a rendering device; use --validate for headless checks")

func fail(message: String) -> void:
	push_error(message)
	set_process(false)
	get_tree().quit(1)

func sample_pose(time: float) -> void:
	player.seek(time, true)
	# Synchronize shot props on frame zero as well as after seeks.
	$RightHandMitten.get_skeleton().force_update_all_bone_transforms()
	$RightHandMitten.on_skeleton_update()
	$LeftWristBandage.on_skeleton_update()
	$Grade/Overlay.material.set_shader_parameter("shot_time", time)

func _process(_delta: float) -> void:
	if still_time >= 0.0:
		if not capture_pending:
			capture_pending = true
			capture_still()
		return
	if frame_index >= FRAME_COUNT:
		print("SHOT complete: 192 frames / 8 s at 24 fps")
		get_tree().quit()
		return
	sample_pose(float(frame_index) / FPS)
	frame_index += 1

func capture_still() -> void:
	# Let the posed scene and shadows settle before reading the real GPU viewport.
	for frame in range(3):
		await RenderingServer.frame_post_draw
	var result := get_viewport().get_texture().get_image().save_png(still_output)
	if result != OK:
		fail("Cannot save still: %s (error %s)" % [still_output, result])
		return
	print("STILL saved: " + still_output)
	get_tree().quit()
