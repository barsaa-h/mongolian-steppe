extends SceneTree

var scene: Node3D
var actors: Node3D
var performance: AnimationPlayer
var clip := Animation.new()
var data: Dictionary

func _initialize() -> void:
	build.call_deferred()

func own(parent: Node, node: Node, label: String) -> Node:
	node.name = label
	parent.add_child(node)
	node.owner = scene
	return node

func from_blender(value: Array) -> Vector3:
	return Vector3(value[0], value[2], -value[1])

func material(color: Color, emission := 0.0) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.9
	if emission > 0:
		mat.emission_enabled = true
		mat.emission = color
		mat.emission_energy_multiplier = emission
	return mat

func shape(parent: Node, label: String, mesh: Mesh, pos: Vector3, mat: Material) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.mesh = mesh
	node.material_override = mat
	own(parent, node, label)
	node.position = pos
	return node

func box(parent: Node, label: String, size: Vector3, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	return shape(parent, label, mesh, pos, mat)

func sphere(parent: Node, label: String, size: Vector3, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := SphereMesh.new()
	mesh.radial_segments = 20
	mesh.rings = 12
	var node := shape(parent, label, mesh, pos, mat)
	node.scale = size
	return node

func light(label: String, pos: Vector3, color: Color, energy: float, reach: float, shadows := false) -> void:
	var lamp := OmniLight3D.new()
	lamp.light_color = color
	lamp.light_energy = energy
	lamp.omni_range = reach
	lamp.shadow_enabled = shadows
	own(scene.get_node("Lighting"), lamp, label)
	lamp.position = pos

func bone_position(skeleton: Skeleton3D, bone: String) -> Vector3:
	return skeleton.get_bone_global_pose(skeleton.find_bone(bone)).origin

func aim(skeleton: Skeleton3D, bone: String, end: String, target: Vector3) -> void:
	var index := skeleton.find_bone(bone)
	var pose := skeleton.get_bone_global_pose(index)
	var old := (bone_position(skeleton, end) - pose.origin).normalized()
	var direction := (target - pose.origin).normalized()
	pose.basis = Basis(Quaternion(old, direction)) * pose.basis
	var parent := skeleton.get_bone_parent(index)
	var local := pose if parent == -1 else skeleton.get_bone_global_pose(parent).affine_inverse() * pose
	skeleton.set_bone_pose_rotation(index, local.basis.orthonormalized().get_rotation_quaternion())
	skeleton.force_update_all_bone_transforms()

func limb(skeleton: Skeleton3D, upper: String, lower: String, end: String, target: Vector3, pole: Vector3) -> void:
	var start := bone_position(skeleton, upper)
	var a := start.distance_to(bone_position(skeleton, lower))
	var b := bone_position(skeleton, lower).distance_to(bone_position(skeleton, end))
	var direction := (target - start).normalized()
	var distance := clampf(start.distance_to(target), absf(a-b) + 0.001, a+b-0.001)
	var along := (a*a - b*b + distance*distance) / (2.0*distance)
	var bend := (pole - start).slide(direction).normalized()
	var elbow := start + direction * along + bend * sqrt(maxf(0.0, a*a-along*along))
	aim(skeleton, upper, lower, elbow)
	aim(skeleton, lower, end, start + direction * distance)

func rotation_track(skeleton: Skeleton3D, bone: int, rotations: Array) -> void:
	var track := clip.add_track(Animation.TYPE_ROTATION_3D)
	clip.track_set_path(track, NodePath(str(scene.get_path_to(skeleton)) + ":" + skeleton.get_bone_name(bone)))
	for key in range(3):
		clip.rotation_track_insert_key(track, key * 4.0, rotations[key])

func add_actor(id: String, anchor: String, target: Vector3) -> Node3D:
	var actor: Node3D = load("res://imports/%s.glb" % id).instantiate()
	own(actors, actor, id.replace("-", "_"))
	actor.position = from_blender(data.anchors[anchor].location)
	actor.look_at(Vector3(target.x, actor.position.y, target.z), Vector3.UP, true)
	var skeleton: Skeleton3D = actor.find_children("*", "Skeleton3D", true, false)[0]
	skeleton.reset_bone_poses()
	return actor

func pose_ganaa(actor: Node3D) -> void:
	var skeleton: Skeleton3D = actor.find_children("*", "Skeleton3D", true, false)[0]
	var root_index := skeleton.find_bone("root")
	var root_pos := skeleton.get_bone_pose_position(root_index) + Vector3(0, -0.52, -0.06)
	skeleton.set_bone_pose_position(root_index, root_pos)
	skeleton.force_update_all_bone_transforms()
	for side in ["L", "R"]:
		var foot := skeleton.get_bone_global_rest(skeleton.find_bone("foot." + side)).origin
		limb(skeleton, "upperleg01." + side, "lowerleg01." + side, "foot." + side, foot, Vector3(foot.x, 0.3, 0.65))
		# Restore the foot's world orientation after bending the knee.
		var foot_index := skeleton.find_bone("foot." + side)
		var parent := skeleton.get_bone_parent(foot_index)
		var basis := skeleton.get_bone_global_pose(parent).basis.inverse() * skeleton.get_bone_global_rest(foot_index).basis
		skeleton.set_bone_pose_rotation(foot_index, basis.orthonormalized().get_rotation_quaternion())
	var local_right := Vector3(-0.15, 0.49, 0.36)
	var local_left := Vector3(0.26, 0.61, -0.24)
	limb(skeleton, "upperarm01.R", "lowerarm01.R", "wrist.R", local_right, Vector3(-0.6, 0.35, 0.1))
	limb(skeleton, "upperarm01.L", "lowerarm01.L", "wrist.L", local_left, Vector3(0.6, 0.4, -0.3))
	var base_rotations := []
	for bone in range(skeleton.get_bone_count()):
		base_rotations.append(skeleton.get_bone_pose_rotation(bone))
	# Artistic choice: a small offered-hand lift at 4 s, returning at 8 s.
	limb(skeleton, "upperarm01.R", "lowerarm01.R", "wrist.R", local_right + Vector3(0, 0.025, 0.015), Vector3(-0.6, 0.35, 0.1))
	for bone in range(skeleton.get_bone_count()):
		rotation_track(skeleton, bone, [base_rotations[bone], skeleton.get_bone_pose_rotation(bone), base_rotations[bone]])
	var track := clip.add_track(Animation.TYPE_POSITION_3D)
	clip.track_set_path(track, NodePath(str(scene.get_path_to(skeleton)) + ":root"))
	for time in [0.0, 4.0, 8.0]:
		clip.position_track_insert_key(track, time, root_pos)
	var right := BoneAttachment3D.new()
	right.bone_name = "wrist.R"
	own(scene, right, "RightHandMitten")
	right.external_skeleton = right.get_path_to(skeleton)
	right.use_external_skeleton = true
	mitten(right, "OfferedRedMitten", Vector3(0, 0.065, 0), false)
	var left := BoneAttachment3D.new()
	left.bone_name = "wrist.L"
	own(scene, left, "LeftWristBandage")
	left.external_skeleton = left.get_path_to(skeleton)
	left.use_external_skeleton = true
	var bandage := CylinderMesh.new()
	bandage.top_radius = 0.039
	bandage.bottom_radius = 0.037
	bandage.height = 0.065
	shape(left, "Gauze", bandage, Vector3.ZERO, material(Color("b9ac91")))

func pose_other(actor: Node3D, child: bool) -> void:
	var skeleton: Skeleton3D = actor.find_children("*", "Skeleton3D", true, false)[0]
	var height := bone_position(skeleton, "head").y
	for side in ["L", "R"]:
		var sign_x := 1.0 if side == "L" else -1.0
		var target := Vector3(sign_x * height * 0.16, height * 0.62, height * 0.28) if child else Vector3(sign_x * height * 0.17, height * 0.48, height * 0.04)
		limb(skeleton, "upperarm01." + side, "lowerarm01." + side, "wrist." + side, target, Vector3(sign_x * height * 0.5, height * 0.5, 0))
	for bone in range(skeleton.get_bone_count()):
		var value := skeleton.get_bone_pose_rotation(bone)
		rotation_track(skeleton, bone, [value, value, value])

func mitten(parent: Node, label: String, pos: Vector3, on_table: bool) -> void:
	var prop := Node3D.new()
	own(parent, prop, label)
	prop.position = pos
	if on_table:
		prop.rotation.x = PI/2.0
	var red := material(Color("a22e38"))
	sphere(prop, "Palm", Vector3(0.07, 0.10, 0.038), Vector3.ZERO, red)
	sphere(prop, "Thumb", Vector3(0.032, 0.055, 0.032), Vector3(0.035, -0.007, 0), red)
	box(prop, "RibbedCuff", Vector3(0.061, 0.028, 0.034), Vector3(0, -0.052, 0), red)
	var stitch := material(Color("c65c57"))
	for rib in range(5):
		box(prop, "KnitRib%d" % rib, Vector3(0.003, 0.062, 0.002), Vector3(-0.023 + rib*0.0115, 0.003, 0.019), stitch)

func dressing(room: Node3D) -> void:
	var props := own(scene, Node3D.new(), "Dressing")
	box(props, "Tablecloth", Vector3(2.84, 0.012, 1.42), Vector3(2.7, 0.797, -3.1), material(Color("b9a88d")))
	for side in [-1.0, 1.0]:
		box(props, "ClothDrop%d" % int(side), Vector3(2.84, 0.18, 0.012), Vector3(2.7, 0.71, -3.1+side*0.71), material(Color("b9a88d")))
	var candle_count := 0
	for node in room.find_children("*", "MeshInstance3D", true, false):
		if str(node.name).begins_with("Birthday_Candle"):
			var position: Vector3 = node.global_position + Vector3(0, 0.08, 0)
			sphere(props, "CandleFlame%d" % candle_count, Vector3(0.018, 0.045, 0.018), position, material(Color("ffbb58"), 4.0))
			candle_count += 1
	assert(candle_count == 3, "Apartment must contain exactly three birthday candles")
	light("CandleGlow", Vector3(2.7, 1.18, -3.1), Color("ffb365"), 0.3, 1.5)
	var colors := ["ad4947", "c59d4b", "647f96", "798965", "a16478", "b98655"]
	for i in range(6):
		var position := Vector3(2.2+i*0.47, 2.18 + (i%2)*0.14, -4.8)
		sphere(props, "Balloon%d" % (i+1), Vector3(0.26, 0.34, 0.26), position, material(Color(colors[i])))
		box(props, "BalloonString%d" % (i+1), Vector3(0.003, 0.55, 0.003), position-Vector3(0,0.44,0), material(Color("bcb39e")))
	mitten(props, "SecondRedMitten", from_blender(data.anchors["ANCHOR.MITTEN_2_TABLE"].location), true)
	var bulb := material(Color("ffcf82"), 1.4)
	sphere(props, "CeilingBulb", Vector3(0.14, 0.18, 0.14), Vector3(2.6, 2.48, -3.1), bulb)

func build() -> void:
	data = JSON.parse_string(FileAccess.get_file_as_string("res://inputs/b23_cams.json"))
	scene = Node3D.new()
	scene.name = "B23_S001"
	root.add_child(scene)
	var room: Node3D = load("res://imports/apartment.glb").instantiate()
	own(scene, room, "Apartment")
	actors = own(scene, Node3D.new(), "Actors")
	performance = own(scene, AnimationPlayer.new(), "Performance")
	clip.length = 8.0
	clip.loop_mode = Animation.LOOP_NONE
	var altan_pos := from_blender(data.anchors["ANCHOR.ALTAN_MITTENS"].location)
	var ganaa_pos := from_blender(data.anchors["ANCHOR.GANAA_MITTENS"].location)
	pose_ganaa(add_actor("ganaa", "ANCHOR.GANAA_MITTENS", altan_pos))
	pose_other(add_actor("altan", "ANCHOR.ALTAN_MITTENS", ganaa_pos), true)
	pose_other(add_actor("party-guest-01", "ANCHOR.GUEST_LIVING_2", altan_pos), false)
	pose_other(add_actor("party-guest-02", "ANCHOR.GUEST_LIVING_3", altan_pos), false)
	var library := AnimationLibrary.new()
	library.add_animation("B23_Mitten_Offer", clip)
	performance.add_animation_library("", library)
	performance.root_node = NodePath("..")
	var cameras := own(scene, Node3D.new(), "Cameras")
	for id in ["CAM_B23_S001", "CAM_B23_S004"]:
		var camera := Camera3D.new()
		own(cameras, camera, id)
		var spec: Dictionary = data.cameras[id]
		var matrix: Array = spec.matrix_world
		var columns := []
		for col in range(4):
			columns.append(from_blender([matrix[0][col], matrix[1][col], matrix[2][col]]))
		camera.transform = Transform3D(Basis(columns[0], columns[1], columns[2]).orthonormalized(), columns[3])
		camera.keep_aspect = Camera3D.KEEP_HEIGHT
		camera.fov = rad_to_deg(2.0 * atan((spec.sensor_mm / (16.0/9.0)) / (2.0*spec.lens_mm)))
		camera.near = 0.03
		camera.far = 60.0
		camera.current = id.ends_with("S001")
		print("CAMERA ", id, " Blender=", [matrix[0][3],matrix[1][3],matrix[2][3]], " Godot=", camera.position, " vertical_fov=", camera.fov)
	var anchors := own(scene, Node3D.new(), "Anchors")
	for id in data.anchors:
		var mark := Marker3D.new()
		own(anchors, mark, id.replace(".", "_"))
		mark.position = from_blender(data.anchors[id].location)
		var euler: Array = data.anchors[id].rotation_euler
		var conversion := Basis(Vector3.RIGHT, Vector3(0, 0, -1), Vector3.UP)
		mark.basis = conversion * Basis.from_euler(Vector3(euler[0],euler[1],euler[2]), EULER_ORDER_XYZ) * conversion.inverse()
	own(scene, Node3D.new(), "Lighting")
	light("WarmCeiling", Vector3(2.6, 2.42, -3.1), Color("ffd09a"), 2.4, 7.0, true)
	light("CoolWindow", Vector3(5.15, 1.7, -2.1), Color("6685ba"), 0.65, 5.0)
	light("HallBounce", Vector3(0.25, 1.8, -1.2), Color("f4cfaa"), 0.45, 4.0)
	var world := WorldEnvironment.new()
	own(scene, world, "WorldEnvironment")
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("101826")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("b8a58c")
	env.ambient_light_energy = 0.25
	env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	env.ssao_enabled = true
	env.ssao_radius = 0.45
	env.ssao_intensity = 1.0
	env.glow_enabled = true
	env.glow_intensity = 0.4
	world.environment = env
	dressing(room)
	var grade := own(scene, CanvasLayer.new(), "Grade")
	var overlay := ColorRect.new()
	own(grade, overlay, "Overlay")
	overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var shader := ShaderMaterial.new()
	shader.shader = load("res://scripts/grade.gdshader")
	overlay.material = shader
	scene.set_script(load("res://scripts/shot.gd"))
	var packed := PackedScene.new()
	assert(packed.pack(scene) == OK)
	assert(ResourceSaver.save(packed, "res://scenes/B23_S001.tscn") == OK)
	print("BUILD PASS: apartment, four rigged actors, 8 s animation, two cameras, dressing and lighting saved")
	scene.free()
	quit()
