extends SceneTree

func _initialize() -> void:
	inspect.call_deferred()

func inspect() -> void:
	for id in ["apartment", "ganaa", "altan", "party-guest-01", "party-guest-02"]:
		var actor = load("res://imports/%s.glb" % id).instantiate()
		root.add_child(actor)
		print("ASSET ", id)
		for node in actor.find_children("*", "Skeleton3D", true, false):
			print("RIG ", actor.get_path_to(node), " bones=", node.get_bone_count(), " transform=", node.global_transform)
			for bone in ["root", "head", "upperleg01.L", "lowerleg01.L", "foot.L", "upperarm01.R", "lowerarm01.R", "wrist.R", "wrist.L"]:
				var index = node.find_bone(bone)
				print("BONE ", bone, " index=", index, " rest=", node.get_bone_global_rest(index).origin)
		for node in actor.find_children("*", "AnimationPlayer", true, false):
			print("ANIMATIONS ", node.get_animation_list())
		var morph_meshes := 0
		for mesh in actor.find_children("*", "MeshInstance3D", true, false):
			if mesh.mesh.get_blend_shape_count() > 0:
				morph_meshes += 1
		print("MORPH_MESHES ", morph_meshes)
		if id == "altan":
			for mesh in actor.find_children("*", "MeshInstance3D", true, false):
				print("ALTAN_MESH ", mesh.name)
		actor.free()
	quit()
