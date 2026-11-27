"""Export the two V2 web GLBs from stillway-ring-v2.blend (same filenames as before).
blender -b stillway-ring-v2.blend -P ring-export-web.py     (does not save the .blend)
"""
import bpy

names = ['Stillway_Ring_Root'] + [o.name for o in bpy.data.collections['Stillway_Ring'].objects]
for o in bpy.context.view_layer.objects:
    o.select_set(o.name in names)

# web GLBs ship with the LEDs off (the web lights them)
for name in ('LED_Main', 'LED_Power'):
    for n in bpy.data.materials[name].node_tree.nodes:
        if n.type == 'BSDF_PRINCIPLED':
            n.inputs['Emission Strength'].default_value = 0

def export(path):
    bpy.ops.export_scene.gltf(filepath=bpy.path.abspath('//' + path), export_format='GLB', use_selection=True,
                              export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
                              export_animations=False)

export('stillway-ring-v2-silver_web.glb')

# polished (D-081): same geometry, no UV, no textures, finishes.json "silver_polished"
for name, color, rough in (('Ring_Silver', (0.92, 0.92, 0.93), 0.06), ('Ring_Silver_Engrave', (0.28, 0.28, 0.29), 0.38)):
    nt = bpy.data.materials[name].node_tree
    bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    for key in ('Base Color', 'Roughness', 'Normal', 'Tangent', 'Anisotropic', 'Anisotropic Rotation', 'Coat Weight', 'Coat Roughness'):
        for link in list(bsdf.inputs[key].links):
            nt.links.remove(link)
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Anisotropic'].default_value = 0
    bsdf.inputs['Coat Weight'].default_value = 0
    bsdf.inputs['Coat Roughness'].default_value = 0.03
    bsdf.inputs['Anisotropic Rotation'].default_value = 0
shell = bpy.data.objects['Ring_Shell'].data
while shell.uv_layers:
    shell.uv_layers.remove(shell.uv_layers[0])
export('stillway-ring-v2-silver-polished_web.glb')
