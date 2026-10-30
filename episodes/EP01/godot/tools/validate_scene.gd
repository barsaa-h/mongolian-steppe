extends SceneTree

var failures := 0
var report := {"actors": {}, "cameras": {}, "samples": []}

func _initialize() -> void:
	validate.call_deferred()

func check(condition: bool, message: String) -> void:
	if not condition:
		failures += 1
		push_error("CHECK FAILED: " + message)

func validate() -> void:
	var packed = load("res://scenes/B23_S001.tscn")
	check(packed is PackedScene, "saved scene loads")
	if not packed is PackedScene:
		quit(1)
		return
	var scene = packed.instantiate()
	root.add_child(scene)
	var player: AnimationPlayer = scene.get_node("Performance")
	var clip := player.get_animation("B23_Mitten_Offer")
	check(is_equal_approx(clip.length, 8.0), "8 s clip")
	check(clip.get_track_count() == 549, "four full rigs plus root-position track")
	for track in range(clip.get_track_count()):
		check(clip.track_get_key_count(track) == 3, "three pose keys per track")
	var required := ["root", "head", "upperleg01.L", "upperleg01.R", "lowerleg01.L", "lowerleg01.R", "foot.L", "foot.R", "upperarm01.L", "upperarm01.R", "lowerarm01.L", "lowerarm01.R", "wrist.L", "wrist.R"]
	for actor in scene.get_node("Actors").get_children():
		var skeletons: Array = actor.find_children("*", "Skeleton3D", true, false)
		check(skeletons.size() == 1, str(actor.name) + " skeleton imported")
		var skeleton: Skeleton3D = skeletons[0]
		check(skeleton.get_bone_count() == 137, str(actor.name) + " all bones retained")
		for bone in required:
			check(skeleton.find_bone(bone) >= 0, str(actor.name) + ":" + bone + " exists")
		var morph_meshes := 0
		var blend_shapes := []
		var material_names := {}
		for mesh in actor.find_children("*", "MeshInstance3D", true, false):
			if mesh.mesh.get_blend_shape_count() > 0:
				morph_meshes += 1
				for index in range(mesh.mesh.get_blend_shape_count()):
					var label := str(mesh.mesh.get_blend_shape_name(index))
					if label not in blend_shapes:
						blend_shapes.append(label)
			for surface in range(mesh.mesh.get_surface_count()):
				var mat = mesh.mesh.surface_get_material(surface)
				if mat is StandardMaterial3D:
					material_names[mat.resource_name] = {"transparency": mat.transparency, "albedo_texture": mat.albedo_texture != null, "normal_enabled": mat.normal_enabled, "roughness": mat.roughness}
		check(morph_meshes > 0, str(actor.name) + " morph targets retained")
		for expression in ["EXP.smile", "EXP.frown", "EXP.blink", "EXP.viseme_A", "EXP.viseme_E", "EXP.viseme_O", "EXP.viseme_M"]:
			check(expression in blend_shapes, str(actor.name) + " expression " + expression)
		var imported_player: AnimationPlayer = actor.find_children("*", "AnimationPlayer", true, false)[0]
		check(imported_player.has_animation("Deformation_Check") and imported_player.has_animation("Talk_Check"), "technical source clips retained")
		report.actors[str(actor.name)] = {"bones": skeleton.get_bone_count(), "posed_bones_checked": required, "morph_meshes": morph_meshes, "blend_shapes": blend_shapes, "source_clips": Array(imported_player.get_animation_list()), "materials": material_names}
		print("ACTOR ", actor.name, ": bones=", skeleton.get_bone_count(), " required_bones=", required.size(), " morph_meshes=", morph_meshes, " blend_shapes=", blend_shapes)
	var data: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://inputs/b23_cams.json"))
	for camera in scene.get_node("Cameras").get_children():
		var spec: Dictionary = data.cameras[str(camera.name)]
		var matrix: Array = spec.matrix_world
		var expected := Vector3(matrix[0][3], matrix[2][3], -matrix[1][3])
		check(camera.position.distance_to(expected) < 0.00001, str(camera.name) + " converted position")
		for col in range(3):
			var basis_column := Vector3(matrix[0][col], matrix[2][col], -matrix[1][col])
			check(camera.basis[col].distance_to(basis_column) < 0.00001, str(camera.name) + " basis column " + str(col))
		var expected_fov := rad_to_deg(2.0*atan((spec.sensor_mm/(16.0/9.0))/(2.0*spec.lens_mm)))
		check(absf(camera.fov-expected_fov) < 0.0001, str(camera.name) + " vertical FOV")
		report.cameras[str(camera.name)] = {"blender_position": [matrix[0][3],matrix[1][3],matrix[2][3]], "godot_position": [camera.position.x,camera.position.y,camera.position.z], "vertical_fov": camera.fov, "basis_matches_json": true}
		print("CAMERA ", camera.name, " JSON=", [matrix[0][3],matrix[1][3],matrix[2][3]], " converted=", camera.position, " fov=", camera.fov, " basis PASS")
	var ganaa: Node3D = scene.get_node("Actors/ganaa")
	var altan: Node3D = scene.get_node("Actors/altan")
	var skeleton: Skeleton3D = ganaa.find_children("*", "Skeleton3D", true, false)[0]
	check(scene.get_node("RightHandMitten").get_skeleton() == skeleton and scene.get_node("RightHandMitten").bone_name == "wrist.R", "offered mitten attached to right wrist")
	check(scene.get_node("LeftWristBandage").get_skeleton() == skeleton and scene.get_node("LeftWristBandage").bone_name == "wrist.L", "bandage attached to left wrist")
	var initial_right := Vector3.ZERO
	for time in [0.0, 4.0, 8.0]:
		scene.sample_pose(time)
		skeleton.force_update_all_bone_transforms()
		await process_frame
		var left := skeleton.to_global(skeleton.get_bone_global_pose(skeleton.find_bone("wrist.L")).origin)
		var right := skeleton.to_global(skeleton.get_bone_global_pose(skeleton.find_bone("wrist.R")).origin)
		var head := skeleton.to_global(skeleton.get_bone_global_pose(skeleton.find_bone("head")).origin)
		check(scene.get_node("RightHandMitten").global_position.distance_to(right) < 0.0001, "right mitten follows wrist after reload")
		check(scene.get_node("LeftWristBandage").global_position.distance_to(left) < 0.0001, "bandage follows left wrist after reload")
		check(left.distance_to(altan.position) > right.distance_to(altan.position) + 0.1, "left wrist farther from Altan at " + str(time))
		check(head.y < 1.25 and head.y > 0.8, "Ganaa crouched at child height")
		for side in ["L", "R"]:
			var foot := skeleton.to_global(skeleton.get_bone_global_pose(skeleton.find_bone("foot." + side)).origin)
			check(foot.y > 0 and foot.y < 0.18, "planted foot height " + side)
		if time == 0.0:
			initial_right = right
		elif time == 4.0:
			check(initial_right.distance_to(right) > 0.015, "midpoint offers mitten with actual bone motion")
		else:
			check(initial_right.distance_to(right) < 0.0001, "pose recovers at clip end")
		report.samples.append({"time": time, "head_y": head.y, "left_wrist_distance_to_altan": left.distance_to(altan.position), "right_wrist_distance_to_altan": right.distance_to(altan.position)})
		print("POSE t=", time, " head=", head, " left_wrist=", left, " right_wrist=", right, " left_distance=", left.distance_to(altan.position), " right_distance=", right.distance_to(altan.position))
	check(scene.get_node("Dressing").find_children("Balloon?", "MeshInstance3D").size() == 6, "six balloons")
	check(scene.get_node("Dressing").find_children("CandleFlame?", "MeshInstance3D").size() == 3, "three candle flames")
	check(altan.find_child("Props_PaperCrown", true, false) != null, "Altan imported paper crown")
	report["failures"] = failures
	var file := FileAccess.open("res://diagnostics/validation.json", FileAccess.WRITE)
	file.store_string(JSON.stringify(report, "\t") + "\n")
	file.close()
	print("VALIDATION ", "PASS" if failures == 0 else "FAIL", ": ", failures, " failures; four rigs, 549 tracks, three times, two camera matrices")
	scene.free()
	quit(0 if failures == 0 else 1)
