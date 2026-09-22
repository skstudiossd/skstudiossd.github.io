"""Rebuild display-only feature edges from the original GLB. Requires numpy."""
from pathlib import Path
import struct,json,urllib.request,math
import numpy as np
root=Path(__file__).resolve().parents[1];p=root/'models/fighter-concept.glb'
raw=p.read_bytes();n=struct.unpack_from('<I',raw,12)[0];d=json.loads(raw[20:20+n]);binary=bytearray(raw[28+n:]);original=len(binary)
def accessor(i):
 a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];dtype={5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1'}[a['componentType']];width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];dt=np.dtype(dtype)
 return np.ndarray((a['count'],width),dtype=dt,buffer=binary,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',width*dt.itemsize),dt.itemsize)).copy()
material=len(d['materials']);d['materials'].append({'name':'CAD feature edges','pbrMetallicRoughness':{'baseColorFactor':[.035,.03,.025,1],'metallicFactor':0,'roughnessFactor':1},'extensions':{'KHR_materials_unlit':{}}})
d.setdefault('extensionsUsed',[])
if 'KHR_materials_unlit' not in d['extensionsUsed']:d['extensionsUsed'].append('KHR_materials_unlit')
# Preserve original shaded triangles. Add only boundary/crease lines, not triangulation.
segments=0
for mesh in d['meshes']:
 lines=[]
 for prim in list(mesh['primitives']):
  if prim.get('mode',4)!=4:continue
  pos=accessor(prim['attributes']['POSITION']);vn=accessor(prim['attributes']['NORMAL']);offset=np.linalg.norm(np.ptp(pos,axis=0))*.00008;inds=accessor(prim['indices']).reshape(-1,3)
  faces=pos[inds];norm=np.cross(faces[:,1]-faces[:,0],faces[:,2]-faces[:,0]);norm/=np.maximum(np.linalg.norm(norm,axis=1,keepdims=True),1e-12)
  # CAD exports often duplicate vertices along surfaces; weld by position for comparison.
  _,inverse=np.unique(np.round(pos,5),axis=0,return_inverse=True)
  edges={}
  for i,tri in enumerate(inds):
   for a,b in [(tri[0],tri[1]),(tri[1],tri[2]),(tri[2],tri[0])]:
    key=tuple(sorted((int(inverse[a]),int(inverse[b]))));edges.setdefault(key,[]).append((i,int(a),int(b)))
  for entries in edges.values():
   keep=len(entries)==1 or any(np.dot(norm[entries[0][0]],norm[e[0]])<math.cos(math.radians(28)) for e in entries[1:])
   if keep:
    _,a,b=entries[0];lines.extend([pos[a]+vn[a]*offset,pos[b]+vn[b]*offset])
 if not lines:continue
 arr=np.asarray(lines,dtype='<f4');segments+=len(lines)//2
 while len(binary)%4:binary.append(0)
 offset=len(binary);binary.extend(arr.tobytes());view=len(d['bufferViews']);d['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':arr.nbytes,'target':34962})
 acc=len(d['accessors']);d['accessors'].append({'bufferView':view,'componentType':5126,'count':len(arr),'type':'VEC3','min':arr.min(0).tolist(),'max':arr.max(0).tolist()})
 mesh['primitives'].append({'attributes':{'POSITION':acc},'mode':1,'material':material})
d['buffers'][0]['byteLength']=len(binary)
j=json.dumps(d,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary+=b'\0'*((-len(binary))%4)
out=struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
(root/'models/fighter-concept-edges.glb').write_bytes(out)
print({'segments':segments,'originalBytes':len(raw),'displayBytes':len(out)})
