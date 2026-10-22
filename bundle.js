(()=>{var hr={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ur={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var Ku=1,Dc=2,li=3,jn=0,Tt=1,jt=2;var ft=0;var Pc=2;var qi=100;var Ul=204,Nl=205;var Ju=0,Gp=1,kp=2,Ai=0,Vp=1,Wp=2,Xp=3,Ic=4,Yp=5,jp=6;var $u=300,Yr=301,jr=302,Ol=303,Fl=304,yo=306,Zr=1e3,Vn=1001,Hl=1002,wt=1003,Ah=1004;var Jo=1005;var Pt=1006,Zp=1007;var Cs=1008;var ot=1009;var Lc=1012,ed=1013,Xn=1014,pn=1015,tr=1016,td=1017,nd=1018,ci=1020;var un=1023;var $i=1026,_i=1027;var id=1029;var rd=1031,sd=1033,$o=33776,el=33777,tl=33778,nl=33779,Sh=35840,_h=35841,Th=35842,bh=35843,ad=36196,Ch=37492,Rh=37496,Dh=37808,Ph=37809,Ih=37810,Lh=37811,Bh=37812,Uh=37813,Nh=37814,Oh=37815,Fh=37816,Hh=37817,zh=37818,Gh=37819,kh=37820,Vh=37821,il=36492,Wh=36494,Xh=36495;var Yh=36284,jh=36285,Zh=36286;var Ha=2300,za=2301,rl=2302,Qh=2400,qh=2401,Kh=2402;var od=3e3,er=3001,_t=3200;var dn="",Ae="srgb",fn="srgb-linear",Bc="display-p3",Eo="display-p3-linear",Ga="linear",gt="srgb",ka="rec709",Va="p3";var wr=7680;var zl=35044;var Jh="300 es",Gl=1035,Qr=2e3,Wa=2001,$t=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let i=t.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}},Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],$h=1234567,Vr=Math.PI/180,Rs=180/Math.PI;function Yn(){let n=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(Kt[255&n]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]+"-"+Kt[255&e]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[63&t|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[255&i]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]).toLowerCase()}function Bt(n,e,t){return Math.max(e,Math.min(t,n))}function kl(n,e){return(n%e+e)%e}function ws(n,e,t){return(1-t)*n+t*e}function Vl(n){return(n&n-1)==0&&n!==0}function Xa(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Wn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(4294967295*n);case Uint16Array:return Math.round(65535*n);case Uint8Array:return Math.round(255*n);case Int32Array:return Math.round(2147483647*n);case Int16Array:return Math.round(32767*n);case Int8Array:return Math.round(127*n);default:throw new Error("Invalid component type.")}}var Fn={DEG2RAD:Vr,RAD2DEG:Rs,generateUUID:Yn,clamp:Bt,euclideanModulo:kl,mapLinear:function(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)},inverseLerp:function(n,e,t){return n!==e?(t-n)/(e-n):0},lerp:ws,damp:function(n,e,t,i){return ws(n,e,1-Math.exp(-t*i))},pingpong:function(n,e=1){return e-Math.abs(kl(n,2*e)-e)},smoothstep:function(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e))*n*(3-2*n)},smootherstep:function(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e))*n*n*(n*(6*n-15)+10)},randInt:function(n,e){return n+Math.floor(Math.random()*(e-n+1))},randFloat:function(n,e){return n+Math.random()*(e-n)},randFloatSpread:function(n){return n*(.5-Math.random())},seededRandom:function(n){n!==void 0&&($h=n);let e=$h+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(n){return n*Vr},radToDeg:function(n){return n*Rs},isPowerOfTwo:Vl,ceilPowerOfTwo:function(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))},floorPowerOfTwo:Xa,setQuaternionFromProperEuler:function(n,e,t,i,r){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),u=s((e-i)/2),d=a((e-i)/2),p=s((i-e)/2),m=a((i-e)/2);switch(r){case"XYX":n.set(o*h,l*u,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*m,l*p,o*c);break;case"YXY":n.set(l*p,o*h,l*m,o*c);break;case"ZYZ":n.set(l*m,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}},normalize:ut,denormalize:Wn},k=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ve=class n{constructor(e,t,i,r,s,a,o,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],p=i[5],m=i[8],x=r[0],f=r[3],y=r[6],v=r[1],g=r[4],w=r[7],b=r[2],_=r[5],M=r[8];return s[0]=a*x+o*v+l*b,s[3]=a*f+o*g+l*_,s[6]=a*y+o*w+l*M,s[1]=c*x+h*v+u*b,s[4]=c*f+h*g+u*_,s[7]=c*y+h*w+u*M,s[2]=d*x+p*v+m*b,s[5]=d*f+p*g+m*_,s[8]=d*y+p*w+m*M,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,p=c*s-a*l,m=t*u+i*d+r*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(r*c-h*i)*x,e[2]=(o*i-r*a)*x,e[3]=d*x,e[4]=(h*t-r*l)*x,e[5]=(r*s-o*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*s)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(sl.makeScale(e,t)),this}rotate(e){return this.premultiply(sl.makeRotation(-e)),this}translate(e,t){return this.premultiply(sl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sl=new Ve;function ld(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ya(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Qp(){let n=Ya("canvas");return n.style.display="block",n}var eu={};function As(n){n in eu||(eu[n]=!0,console.warn(n))}var tu=new Ve().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),nu=new Ve().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),sa={[fn]:{transfer:Ga,primaries:ka,toReference:n=>n,fromReference:n=>n},[Ae]:{transfer:gt,primaries:ka,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Eo]:{transfer:Ga,primaries:Va,toReference:n=>n.applyMatrix3(nu),fromReference:n=>n.applyMatrix3(tu)},[Bc]:{transfer:gt,primaries:Va,toReference:n=>n.convertSRGBToLinear().applyMatrix3(nu),fromReference:n=>n.applyMatrix3(tu).convertLinearToSRGB()}},qp=new Set([fn,Eo]),dt={enabled:!0,_workingColorSpace:fn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!qp.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;let i=sa[e].toReference;return(0,sa[t].fromReference)(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return sa[n].primaries},getTransfer:function(n){return n===dn?Ga:sa[n].transfer}};function Wr(n){return n<.04045?.0773993808*n:Math.pow(.9478672986*n+.0521327014,2.4)}function al(n){return n<.0031308?12.92*n:1.055*Math.pow(n,.41666)-.055}var Ar,ja=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ar===void 0&&(Ar=Ya("canvas")),Ar.width=e.width,Ar.height=e.height;let i=Ar.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ar}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ya("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=255*Wr(s[a]/255);return i.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*Wr(t[i]/255)):t[i]=Wr(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Kp=0,Za=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=Yn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ol(r[a].image)):s.push(ol(r[a]))}else s=ol(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function ol(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ja.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Jp=0,Vt=class n extends $t{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=n.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=Yn(),this.name="",this.source=new Za(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new k(0,0),this.repeat=new k(1,1),this.center=new k(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===er?Ae:dn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$u)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Zr:e.x=e.x-Math.floor(e.x);break;case Vn:e.x=e.x<0?0:1;break;case Hl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Zr:e.y=e.y-Math.floor(e.y);break;case Vn:e.y=e.y<0?0:1;break;case Hl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?er:od}set encoding(e){As("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===er?Ae:dn}};Vt.DEFAULT_IMAGE=null,Vt.DEFAULT_MAPPING=$u,Vt.DEFAULT_ANISOTROPY=1;var et=class n{constructor(e=0,t=0,i=0,r=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],m=l[9],x=l[2],f=l[6],y=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+f)<.1&&Math.abs(c+p+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let g=(c+1)/2,w=(p+1)/2,b=(y+1)/2,_=(h+d)/4,M=(u+x)/4,P=(m+f)/4;return g>w&&g>b?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=_/i,s=M/i):w>b?w<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(w),i=_/r,s=P/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=M/s,r=P/s),this.set(i,r,s,t),this}let v=Math.sqrt((f-m)*(f-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(f-m)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+y-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Wl=class extends $t{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new et(0,0,e,t),this.scissorTest=!1,this.viewport=new et(0,0,e,t);let r={width:e,height:t,depth:1};i.encoding!==void 0&&(As("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===er?Ae:dn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Vt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){this.width===e&&this.height===t&&this.depth===i||(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Za(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fe=class extends Wl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Qa=class extends Vt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=wt,this.minFilter=wt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ds=class extends Vt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=wt,this.minFilter=wt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var en=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],u=i[r+3],d=s[a+0],p=s[a+1],m=s[a+2],x=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=p,e[t+2]=m,void(e[t+3]=x);if(u!==x||l!==d||c!==p||h!==m){let f=1-o,y=l*d+c*p+h*m+u*x,v=y>=0?1:-1,g=1-y*y;if(g>Number.EPSILON){let b=Math.sqrt(g),_=Math.atan2(b,y*v);f=Math.sin(f*_)/b,o=Math.sin(o*_)/b}let w=o*v;if(l=l*f+d*w,c=c*f+p*w,h=h*f+m*w,u=u*f+x*w,f===1-o){let b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,r,s,a){let o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],u=s[a],d=s[a+1],p=s[a+2],m=s[a+3];return e[t]=o*m+h*u+l*p-c*d,e[t+1]=l*m+h*d+c*u-o*p,e[t+2]=c*m+h*p+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),u=o(s/2),d=l(i/2),p=l(r/2),m=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"YXZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"ZXY":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"ZYX":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"YZX":this._x=d*h*u+c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u-d*p*m;break;case"XZY":this._x=d*h*u-c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u+d*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Bt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,r=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},E=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(iu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(iu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*t-s*r),u=2*(s*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-s*u,this.z=r+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ll.copy(this).projectOnVector(e),this.sub(ll)}reflect(e){return this.sub(ll.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=2*(Math.random()-.5),t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ll=new E,iu=new en,Zn=class{constructor(e=new E(1/0,1/0,1/0),t=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ln):Ln.fromBufferAttribute(s,a),Ln.applyMatrix4(e.matrixWorld),this.expandByPoint(Ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),aa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),aa.copy(i.boundingBox)),aa.applyMatrix4(e.matrixWorld),this.union(aa)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Ln),Ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ps),oa.subVectors(this.max,ps),Sr.subVectors(e.a,ps),_r.subVectors(e.b,ps),Tr.subVectors(e.c,ps),vi.subVectors(_r,Sr),xi.subVectors(Tr,_r),Xi.subVectors(Sr,Tr);let t=[0,-vi.z,vi.y,0,-xi.z,xi.y,0,-Xi.z,Xi.y,vi.z,0,-vi.x,xi.z,0,-xi.x,Xi.z,0,-Xi.x,-vi.y,vi.x,0,-xi.y,xi.x,0,-Xi.y,Xi.x,0];return!!cl(t,Sr,_r,Tr,oa)&&(t=[1,0,0,0,1,0,0,0,1],!!cl(t,Sr,_r,Tr,oa)&&(la.crossVectors(vi,xi),t=[la.x,la.y,la.z],cl(t,Sr,_r,Tr,oa)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Ln).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ii)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},ii=[new E,new E,new E,new E,new E,new E,new E,new E],Ln=new E,aa=new Zn,Sr=new E,_r=new E,Tr=new E,vi=new E,xi=new E,Xi=new E,ps=new E,oa=new E,la=new E,Yi=new E;function cl(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Yi.fromArray(n,s);let o=r.x*Math.abs(Yi.x)+r.y*Math.abs(Yi.y)+r.z*Math.abs(Yi.z),l=e.dot(Yi),c=t.dot(Yi),h=i.dot(Yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var $p=new Zn,fs=new E,hl=new E,Qn=class{constructor(e=new E,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):$p.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fs.subVectors(e,this.center);let t=fs.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=.5*(i-this.radius);this.center.addScaledVector(fs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fs.copy(e.center).add(hl)),this.expandByPoint(fs.copy(e.center).sub(hl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ri=new E,ul=new E,ca=new E,yi=new E,dl=new E,ha=new E,pl=new E,Ti=class{constructor(e=new E,t=new E(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ul.copy(e).add(t).multiplyScalar(.5),ca.copy(t).sub(e).normalize(),yi.copy(this.origin).sub(ul);let s=.5*e.distanceTo(t),a=-this.direction.dot(ca),o=yi.dot(this.direction),l=-yi.dot(ca),c=yi.lengthSq(),h=Math.abs(1-a*a),u,d,p,m;if(h>0)if(u=a*l-o,d=a*o-l,m=s*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ul).addScaledVector(ca,d),p}intersectSphere(e,t){ri.subVectors(e.center,this.origin);let i=ri.dot(this.direction),r=ri.dot(ri)-i*i,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||s>r?null:((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>r?null:((o>i||i!=i)&&(i=o),(l<r||r!=r)&&(r=l),r<0?null:this.at(i>=0?i:r,t)))}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,i,r,s){dl.subVectors(t,e),ha.subVectors(i,e),pl.crossVectors(dl,ha);let a,o=this.direction.dot(pl);if(o>0){if(r)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}yi.subVectors(this.origin,e);let l=a*this.direction.dot(ha.crossVectors(yi,ha));if(l<0)return null;let c=a*this.direction.dot(dl.cross(yi));if(c<0||l+c>o)return null;let h=-a*yi.dot(pl);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ne=class n{constructor(e,t,i,r,s,a,o,l,c,h,u,d,p,m,x,f){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,h,u,d,p,m,x,f)}set(e,t,i,r,s,a,o,l,c,h,u,d,p,m,x,f){let y=this.elements;return y[0]=e,y[4]=t,y[8]=i,y[12]=r,y[1]=s,y[5]=a,y[9]=o,y[13]=l,y[2]=c,y[6]=h,y[10]=u,y[14]=d,y[3]=p,y[7]=m,y[11]=x,y[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,r=1/br.setFromMatrixColumn(e,0).length(),s=1/br.setFromMatrixColumn(e,1).length(),a=1/br.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*h,p=a*u,m=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,m=c*h,x=c*u;t[0]=d+x*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-m,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,m=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,p=a*u,m=o*h,x=o*u;t[0]=l*h,t[4]=m*c-p,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,p=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=m*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+m,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,p=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ef,e,tf)}lookAt(e,t,i){let r=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Ei.crossVectors(i,En),Ei.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Ei.crossVectors(i,En)),Ei.normalize(),ua.crossVectors(En,Ei),r[0]=Ei.x,r[4]=ua.x,r[8]=En.x,r[1]=Ei.y,r[5]=ua.y,r[9]=En.y,r[2]=Ei.z,r[6]=ua.z,r[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],p=i[13],m=i[2],x=i[6],f=i[10],y=i[14],v=i[3],g=i[7],w=i[11],b=i[15],_=r[0],M=r[4],P=r[8],R=r[12],I=r[1],N=r[5],C=r[9],z=r[13],O=r[2],q=r[6],le=r[10],J=r[14],Z=r[3],$=r[7],U=r[11],V=r[15];return s[0]=a*_+o*I+l*O+c*Z,s[4]=a*M+o*N+l*q+c*$,s[8]=a*P+o*C+l*le+c*U,s[12]=a*R+o*z+l*J+c*V,s[1]=h*_+u*I+d*O+p*Z,s[5]=h*M+u*N+d*q+p*$,s[9]=h*P+u*C+d*le+p*U,s[13]=h*R+u*z+d*J+p*V,s[2]=m*_+x*I+f*O+y*Z,s[6]=m*M+x*N+f*q+y*$,s[10]=m*P+x*C+f*le+y*U,s[14]=m*R+x*z+f*J+y*V,s[3]=v*_+g*I+w*O+b*Z,s[7]=v*M+g*N+w*q+b*$,s[11]=v*P+g*C+w*le+b*U,s[15]=v*R+g*z+w*J+b*V,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*l*u-r*c*u-s*o*d+i*c*d+r*o*p-i*l*p)+e[7]*(+t*l*p-t*c*d+s*a*d-r*a*p+r*c*h-s*l*h)+e[11]*(+t*c*u-t*o*p-s*a*u+i*a*p+s*o*h-i*c*h)+e[15]*(-r*o*h-t*l*u+t*o*d+r*a*u-i*a*d+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],m=e[12],x=e[13],f=e[14],y=e[15],v=u*f*c-x*d*c+x*l*p-o*f*p-u*l*y+o*d*y,g=m*d*c-h*f*c-m*l*p+a*f*p+h*l*y-a*d*y,w=h*x*c-m*u*c+m*o*p-a*x*p-h*o*y+a*u*y,b=m*u*l-h*x*l-m*o*d+a*x*d+h*o*f-a*u*f,_=t*v+i*g+r*w+s*b;if(_===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let M=1/_;return e[0]=v*M,e[1]=(x*d*s-u*f*s-x*r*p+i*f*p+u*r*y-i*d*y)*M,e[2]=(o*f*s-x*l*s+x*r*c-i*f*c-o*r*y+i*l*y)*M,e[3]=(u*l*s-o*d*s-u*r*c+i*d*c+o*r*p-i*l*p)*M,e[4]=g*M,e[5]=(h*f*s-m*d*s+m*r*p-t*f*p-h*r*y+t*d*y)*M,e[6]=(m*l*s-a*f*s-m*r*c+t*f*c+a*r*y-t*l*y)*M,e[7]=(a*d*s-h*l*s+h*r*c-t*d*c-a*r*p+t*l*p)*M,e[8]=w*M,e[9]=(m*u*s-h*x*s-m*i*p+t*x*p+h*i*y-t*u*y)*M,e[10]=(a*x*s-m*o*s+m*i*c-t*x*c-a*i*y+t*o*y)*M,e[11]=(h*o*s-a*u*s-h*i*c+t*u*c+a*i*p-t*o*p)*M,e[12]=b*M,e[13]=(h*x*r-m*u*r+m*i*d-t*x*d-h*i*f+t*u*f)*M,e[14]=(m*o*r-a*x*r-m*i*l+t*x*l+a*i*f-t*o*f)*M,e[15]=(a*u*r-h*o*r+h*i*l-t*u*l-a*i*d+t*o*d)*M,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,p=s*h,m=s*u,x=a*h,f=a*u,y=o*u,v=l*c,g=l*h,w=l*u,b=i.x,_=i.y,M=i.z;return r[0]=(1-(x+y))*b,r[1]=(p+w)*b,r[2]=(m-g)*b,r[3]=0,r[4]=(p-w)*_,r[5]=(1-(d+y))*_,r[6]=(f+v)*_,r[7]=0,r[8]=(m+g)*M,r[9]=(f-v)*M,r[10]=(1-(d+x))*M,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements,s=br.set(r[0],r[1],r[2]).length(),a=br.set(r[4],r[5],r[6]).length(),o=br.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Bn.copy(this);let l=1/s,c=1/a,h=1/o;return Bn.elements[0]*=l,Bn.elements[1]*=l,Bn.elements[2]*=l,Bn.elements[4]*=c,Bn.elements[5]*=c,Bn.elements[6]*=c,Bn.elements[8]*=h,Bn.elements[9]*=h,Bn.elements[10]*=h,t.setFromRotationMatrix(Bn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(i-r),u=(t+e)/(t-e),d=(i+r)/(i-r),p,m;if(o===Qr)p=-(a+s)/(a-s),m=-2*a*s/(a-s);else{if(o!==Wa)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),m=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(i-r),u=1/(a-s),d=(t+e)*c,p=(i+r)*h,m,x;if(o===Qr)m=(a+s)*u,x=-2*u;else{if(o!==Wa)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=s*u,x=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},br=new E,Bn=new Ne,ef=new E(0,0,0),tf=new E(1,1,1),Ei=new E,ua=new E,En=new E,ru=new Ne,su=new en,qa=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Bt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Bt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ru.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ru,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return su.setFromEuler(this),this.setFromQuaternion(su,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qa.DEFAULT_ORDER="XYZ";var Ka=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},nf=0,au=new E,Cr=new en,si=new Ne,da=new E,ms=new E,rf=new E,sf=new en,ou=new E(1,0,0),lu=new E(0,1,0),cu=new E(0,0,1),af={type:"added"},of={type:"removed"},Wt=class n extends $t{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=Yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new E,t=new qa,i=new en,r=new E(1,1,1);t._onChange((function(){i.setFromEuler(t,!1)})),i._onChange((function(){t.setFromQuaternion(i,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ne},normalMatrix:{value:new Ve}}),this.matrix=new Ne,this.matrixWorld=new Ne,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Cr.setFromAxisAngle(e,t),this.quaternion.multiply(Cr),this}rotateOnWorldAxis(e,t){return Cr.setFromAxisAngle(e,t),this.quaternion.premultiply(Cr),this}rotateX(e){return this.rotateOnAxis(ou,e)}rotateY(e){return this.rotateOnAxis(lu,e)}rotateZ(e){return this.rotateOnAxis(cu,e)}translateOnAxis(e,t){return au.copy(e).applyQuaternion(this.quaternion),this.position.add(au.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ou,e)}translateY(e){return this.translateOnAxis(lu,e)}translateZ(e){return this.translateOnAxis(cu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?da.copy(e):da.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(ms,da,this.up):si.lookAt(da,ms,this.up),this.quaternion.setFromRotationMatrix(si),r&&(si.extractRotation(r.matrixWorld),Cr.setFromRotationMatrix(si),this.quaternion.premultiply(Cr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(af)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(of)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),si.multiply(e.parent.matrixWorld)),e.applyMatrix4(si),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,e,rf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,sf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++){let s=t[i];s.matrixWorldAutoUpdate!==!0&&e!==!0||s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let r=this.children;for(let s=0,a=r.length;s<a;s++){let o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map((o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()}))),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=r,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}};Wt.DEFAULT_UP=new E(0,1,0),Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0,Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Un=new E,ai=new E,fl=new E,oi=new E,Rr=new E,Dr=new E,hu=new E,ml=new E,gl=new E,vl=new E,pa=!1,wi=class n{constructor(e=new E,t=new E,i=new E){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Un.subVectors(e,t),r.cross(Un);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Un.subVectors(r,t),ai.subVectors(i,t),fl.subVectors(e,t);let a=Un.dot(Un),o=Un.dot(ai),l=Un.dot(fl),c=ai.dot(ai),h=ai.dot(fl),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,m=(a*h-o*l)*d;return s.set(1-p-m,m,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,oi)!==null&&oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getUV(e,t,i,r,s,a,o,l){return pa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),pa=!0),this.getInterpolation(e,t,i,r,s,a,o,l)}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,oi.x),l.addScaledVector(a,oi.y),l.addScaledVector(o,oi.z),l)}static isFrontFacing(e,t,i,r){return Un.subVectors(i,t),ai.subVectors(e,t),Un.cross(ai).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),ai.subVectors(this.a,this.b),.5*Un.cross(ai).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return pa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),pa=!0),n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,a,o;Rr.subVectors(r,i),Dr.subVectors(s,i),ml.subVectors(e,i);let l=Rr.dot(ml),c=Dr.dot(ml);if(l<=0&&c<=0)return t.copy(i);gl.subVectors(e,r);let h=Rr.dot(gl),u=Dr.dot(gl);if(h>=0&&u<=h)return t.copy(r);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Rr,a);vl.subVectors(e,s);let p=Rr.dot(vl),m=Dr.dot(vl);if(m>=0&&p<=m)return t.copy(s);let x=p*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Dr,o);let f=h*m-p*u;if(f<=0&&u-h>=0&&p-m>=0)return hu.subVectors(s,r),o=(u-h)/(u-h+(p-m)),t.copy(r).addScaledVector(hu,o);let y=1/(f+x+d);return a=x*y,o=d*y,t.copy(i).addScaledVector(Rr,a).addScaledVector(Dr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mi={h:0,s:0,l:0},fa={h:0,s:0,l:0};function xl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+6*(e-n)*t:t<.5?e:t<2/3?n+6*(e-n)*(2/3-t):n}var he=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ae){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,dt.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=dt.workingColorSpace){if(e=kl(e,1),t=Bt(t,0,1),i=Bt(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=xl(a,s,e+1/3),this.g=xl(a,s,e),this.b=xl(a,s,e-1/3)}return dt.toWorkingColorSpace(this,r),this}setStyle(e,t=Ae){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ae){let i=cd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wr(e.r),this.g=Wr(e.g),this.b=Wr(e.b),this}copyLinearToSRGB(e){return this.r=al(e.r),this.g=al(e.g),this.b=al(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ae){return dt.fromWorkingColorSpace(Jt.copy(this),e),65536*Math.round(Bt(255*Jt.r,0,255))+256*Math.round(Bt(255*Jt.g,0,255))+Math.round(Bt(255*Jt.b,0,255))}getHexString(e=Ae){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(Jt.copy(this),t);let i=Jt.r,r=Jt.g,s=Jt.b,a=Math.max(i,r,s),o=Math.min(i,r,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=Ae){dt.fromWorkingColorSpace(Jt.copy(this),e);let t=Jt.r,i=Jt.g,r=Jt.b;return e!==Ae?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*r)})`}offsetHSL(e,t,i){return this.getHSL(Mi),this.setHSL(Mi.h+e,Mi.s+t,Mi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Mi),e.getHSL(fa);let i=ws(Mi.h,fa.h,t),r=ws(Mi.s,fa.s,t),s=ws(Mi.l,fa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Jt=new he;he.NAMES=cd;var lf=0,wn=class extends $t{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lf++}),this.uuid=Yn(),this.name="",this.type="Material",this.blending=1,this.side=jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ul,this.blendDst=Nl,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wr,this.stencilZFail=wr,this.stencilZPass=wr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r!==void 0?r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==jn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ul&&(i.blendSrc=this.blendSrc),this.blendDst!==Nl&&(i.blendDst=this.blendDst),this.blendEquation!==qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Xt=class extends wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ju,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$v=cf();function cf(){let n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[256|l]=32768,r[l]=24,r[256|l]=24):c<-14?(i[l]=1024>>-c-14,i[256|l]=1024>>-c-14|32768,r[l]=-c-1,r[256|l]=-c-1):c<=15?(i[l]=c+15<<10,i[256|l]=c+15<<10|32768,r[l]=13,r[256|l]=13):c<128?(i[l]=31744,i[256|l]=64512,r[l]=24,r[256|l]=24):(i[l]=31744,i[256|l]=64512,r[l]=13,r[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(8388608&c)==0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}var Dt=new E,ma=new k,Ut=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=zl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ma.fromBufferAttribute(this,t),ma.applyMatrix3(e),this.setXY(t,ma.x,ma.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Wn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Wn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Wn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Wn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Wn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==zl&&(e.usage=this.usage),e}};var Ja=class extends Ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var $a=class extends Ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var _e=class extends Ut{constructor(e,t,i){super(new Float32Array(e),t,i)}};var hf=0,bn=new Ne,yl=new Wt,Pr=new E,Mn=new Zn,gs=new Zn,Ht=new E,tt=class n extends $t{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=Yn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ld(e)?$a:Ja)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return bn.makeRotationFromQuaternion(e),this.applyMatrix4(bn),this}rotateX(e){return bn.makeRotationX(e),this.applyMatrix4(bn),this}rotateY(e){return bn.makeRotationY(e),this.applyMatrix4(bn),this}rotateZ(e){return bn.makeRotationZ(e),this.applyMatrix4(bn),this}translate(e,t,i){return bn.makeTranslation(e,t,i),this.applyMatrix4(bn),this}scale(e,t,i){return bn.makeScale(e,t,i),this.applyMatrix4(bn),this}lookAt(e){return yl.lookAt(e),yl.updateMatrix(),this.applyMatrix4(yl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pr).negate(),this.translate(Pr.x,Pr.y,Pr.z),this}setFromPoints(e){let t=[];for(let i=0,r=e.length;i<r;i++){let s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new _e(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];Mn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingSphere.set(new E,1/0);if(e){let i=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(Mn.min,gs.min),Mn.expandByPoint(Ht),Ht.addVectors(Mn.max,gs.max),Mn.expandByPoint(Ht)):(Mn.expandByPoint(gs.min),Mn.expandByPoint(gs.max))}Mn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ht.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ht));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ht.fromBufferAttribute(o,c),l&&(Pr.fromBufferAttribute(e,c),Ht.add(Pr)),r=Math.max(r,i.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=e.array,r=t.position.array,s=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let I=0;I<o;I++)c[I]=new E,h[I]=new E;let u=new E,d=new E,p=new E,m=new k,x=new k,f=new k,y=new E,v=new E;function g(I,N,C){u.fromArray(r,3*I),d.fromArray(r,3*N),p.fromArray(r,3*C),m.fromArray(a,2*I),x.fromArray(a,2*N),f.fromArray(a,2*C),d.sub(u),p.sub(u),x.sub(m),f.sub(m);let z=1/(x.x*f.y-f.x*x.y);isFinite(z)&&(y.copy(d).multiplyScalar(f.y).addScaledVector(p,-x.y).multiplyScalar(z),v.copy(p).multiplyScalar(x.x).addScaledVector(d,-f.x).multiplyScalar(z),c[I].add(y),c[N].add(y),c[C].add(y),h[I].add(v),h[N].add(v),h[C].add(v))}let w=this.groups;w.length===0&&(w=[{start:0,count:i.length}]);for(let I=0,N=w.length;I<N;++I){let C=w[I],z=C.start;for(let O=z,q=z+C.count;O<q;O+=3)g(i[O+0],i[O+1],i[O+2])}let b=new E,_=new E,M=new E,P=new E;function R(I){M.fromArray(s,3*I),P.copy(M);let N=c[I];b.copy(N),b.sub(M.multiplyScalar(M.dot(N))).normalize(),_.crossVectors(P,N);let C=_.dot(h[I])<0?-1:1;l[4*I]=b.x,l[4*I+1]=b.y,l[4*I+2]=b.z,l[4*I+3]=C}for(let I=0,N=w.length;I<N;++I){let C=w[I],z=C.start;for(let O=z,q=z+C.count;O<q;O+=3)R(i[O+0]),R(i[O+1]),R(i[O+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ut(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let r=new E,s=new E,a=new E,o=new E,l=new E,c=new E,h=new E,u=new E;if(e)for(let d=0,p=e.count;d<p;d+=3){let m=e.getX(d+0),x=e.getX(d+1),f=e.getX(d+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,f),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,f),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,m=0;for(let x=0,f=l.length;x<f;x++){p=o.isInterleavedBufferAttribute?l[x]*o.data.stride+o.offset:l[x]*h;for(let y=0;y<h;y++)d[m++]=c[p++]}return new Ut(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let o in r){let l=e(r[o],i);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let r=e.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},uu=new Ne,ji=new Ti,ga=new Qn,du=new E,Ir=new E,Lr=new E,Br=new E,El=new E,va=new E,xa=new k,ya=new k,Ea=new k,pu=new E,fu=new E,mu=new E,Ma=new E,wa=new E,Je=class extends Wt{constructor(e=new tt,t=new Xt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){va.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(El.fromBufferAttribute(u,e),a?va.addScaledVector(El,h):va.addScaledVector(El.sub(t),h))}t.add(va)}return t}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;if(r!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),ga.copy(i.boundingSphere),ga.applyMatrix4(s),ji.copy(e.ray).recast(e.near),ga.containsPoint(ji.origin)===!1&&(ji.intersectSphere(ga,du)===null||ji.origin.distanceToSquared(du)>(e.far-e.near)**2))return;uu.copy(s).invert(),ji.copy(e.ray).applyMatrix4(uu),i.boundingBox!==null&&ji.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,ji)}}_computeIntersections(e,t,i){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let f=d[m],y=a[f.materialIndex];for(let v=Math.max(f.start,p.start),g=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));v<g;v+=3)r=Aa(this,y,e,i,c,h,u,o.getX(v),o.getX(v+1),o.getX(v+2)),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let m=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);m<x;m+=3)r=Aa(this,a,e,i,c,h,u,o.getX(m),o.getX(m+1),o.getX(m+2)),r&&(r.faceIndex=Math.floor(m/3),t.push(r));else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let f=d[m],y=a[f.materialIndex];for(let v=Math.max(f.start,p.start),g=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));v<g;v+=3)r=Aa(this,y,e,i,c,h,u,v,v+1,v+2),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let m=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);m<x;m+=3)r=Aa(this,a,e,i,c,h,u,m,m+1,m+2),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}};function Aa(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Ir),n.getVertexPosition(l,Lr),n.getVertexPosition(c,Br);let h=(function(u,d,p,m,x,f,y,v){let g;if(g=d.side===Tt?m.intersectTriangle(y,f,x,!0,v):m.intersectTriangle(x,f,y,d.side===jn,v),g===null)return null;wa.copy(v),wa.applyMatrix4(u.matrixWorld);let w=p.ray.origin.distanceTo(wa);return w<p.near||w>p.far?null:{distance:w,point:wa.clone(),object:u}})(n,e,t,i,Ir,Lr,Br,Ma);if(h){r&&(xa.fromBufferAttribute(r,o),ya.fromBufferAttribute(r,l),Ea.fromBufferAttribute(r,c),h.uv=wi.getInterpolation(Ma,Ir,Lr,Br,xa,ya,Ea,new k)),s&&(xa.fromBufferAttribute(s,o),ya.fromBufferAttribute(s,l),Ea.fromBufferAttribute(s,c),h.uv1=wi.getInterpolation(Ma,Ir,Lr,Br,xa,ya,Ea,new k),h.uv2=h.uv1),a&&(pu.fromBufferAttribute(a,o),fu.fromBufferAttribute(a,l),mu.fromBufferAttribute(a,c),h.normal=wi.getInterpolation(Ma,Ir,Lr,Br,pu,fu,mu,new E),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new E,materialIndex:0};wi.getNormal(Ir,Lr,Br,u.normal),h.face=u}return h}var we=class n extends tt{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;function m(x,f,y,v,g,w,b,_,M,P,R){let I=w/M,N=b/P,C=w/2,z=b/2,O=_/2,q=M+1,le=P+1,J=0,Z=0,$=new E;for(let U=0;U<le;U++){let V=U*N-z;for(let te=0;te<q;te++){let A=te*I-C;$[x]=A*v,$[f]=V*g,$[y]=O,c.push($.x,$.y,$.z),$[x]=0,$[f]=0,$[y]=_>0?1:-1,h.push($.x,$.y,$.z),u.push(te/M),u.push(1-U/P),J+=1}}for(let U=0;U<P;U++)for(let V=0;V<M;V++){let te=d+V+q*U,A=d+V+q*(U+1),S=d+(V+1)+q*(U+1),G=d+(V+1)+q*U;l.push(te,A,G),l.push(A,S,G),Z+=6}o.addGroup(p,Z,R),p+=Z,d+=J}m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,r,a,2),m("x","z","y",1,-1,e,i,-t,r,a,3),m("x","y","z",1,-1,e,t,i,r,s,4),m("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new _e(c,3)),this.setAttribute("normal",new _e(h,3)),this.setAttribute("uv",new _e(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function qr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function on(n){let e={};for(let t=0;t<n.length;t++){let i=qr(n[t]);for(let r in i)e[r]=i[r]}return e}function hd(n){return n.getRenderTarget()===null?n.outputColorSpace:dt.workingColorSpace}var uf={clone:qr,merge:on},He=class extends wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qr(e.uniforms),this.uniformsGroups=(function(t){let i=[];for(let r=0;r<t.length;r++)i.push(t[r].clone());return i})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},nr=class extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ne,this.projectionMatrix=new Ne,this.projectionMatrixInverse=new Ne,this.coordinateSystem=Qr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},At=class extends nr{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*Rs*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*Vr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*Rs*Math.atan(Math.tan(.5*Vr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*Vr*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ur=-90,Xl=class extends Wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new At(Ur,1,e,t);r.layers=this.layers,this.add(r);let s=new At(Ur,1,e,t);s.layers=this.layers,this.add(s);let a=new At(Ur,1,e,t);a.layers=this.layers,this.add(a);let o=new At(Ur,1,e,t);o.layers=this.layers,this.add(o);let l=new At(Ur,1,e,t);l.layers=this.layers,this.add(l);let c=new At(Ur,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Qr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==Wa)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},eo=class extends Vt{constructor(e,t,i,r,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:Yr,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Yl=class extends Fe{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(As("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===er?Ae:dn),this.texture=new eo(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Pt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new we(5,5,5),s=new He({name:"CubemapFromEquirect",uniforms:qr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Tt,blending:0});s.uniforms.tEquirect.value=t;let a=new Je(r,s),o=t.minFilter;return t.minFilter===Cs&&(t.minFilter=Pt),new Xl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}},Ml=new E,df=new E,pf=new Ve,Nn=class{constructor(e=new E(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=Ml.subVectors(i,t).cross(df.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Ml),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||pf.getNormalMatrix(e),r=this.coplanarPoint(Ml).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Zi=new Qn,Sa=new E,Kr=class{constructor(e=new Nn,t=new Nn,i=new Nn,r=new Nn,s=new Nn,a=new Nn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){let i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],u=r[6],d=r[7],p=r[8],m=r[9],x=r[10],f=r[11],y=r[12],v=r[13],g=r[14],w=r[15];if(i[0].setComponents(l-s,d-c,f-p,w-y).normalize(),i[1].setComponents(l+s,d+c,f+p,w+y).normalize(),i[2].setComponents(l+a,d+h,f+m,w+v).normalize(),i[3].setComponents(l-a,d-h,f-m,w-v).normalize(),i[4].setComponents(l-o,d-u,f-x,w-g).normalize(),t===Qr)i[5].setComponents(l+o,d+u,f+x,w+g).normalize();else{if(t!==Wa)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);i[5].setComponents(o,u,x,g).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){return Zi.center.set(0,0,0),Zi.radius=.7071067811865476,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(Sa.x=r.normal.x>0?e.max.x:e.min.x,Sa.y=r.normal.y>0?e.max.y:e.min.y,Sa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Sa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ud(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function ff(n,e){let t=e.isWebGL2,i=new WeakMap;return{get:function(r){return r.isInterleavedBufferAttribute&&(r=r.data),i.get(r)},remove:function(r){r.isInterleavedBufferAttribute&&(r=r.data);let s=i.get(r);s&&(n.deleteBuffer(s.buffer),i.delete(r))},update:function(r,s){if(r.isGLBufferAttribute){let o=i.get(r);return void((!o||o.version<r.version)&&i.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version}))}r.isInterleavedBufferAttribute&&(r=r.data);let a=i.get(r);if(a===void 0)i.set(r,(function(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer(),p;if(n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback(),c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)if(o.isFloat16BufferAttribute){if(!t)throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");p=n.HALF_FLOAT}else p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else{if(!(c instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);p=n.UNSIGNED_BYTE}return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}})(r,s));else if(a.version<r.version){if(a.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(o,l,c){let h=l.array,u=l._updateRange,d=l.updateRanges;if(n.bindBuffer(c,o),u.count===-1&&d.length===0&&n.bufferSubData(c,0,h),d.length!==0){for(let p=0,m=d.length;p<m;p++){let x=d[p];t?n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count):n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h.subarray(x.start,x.start+x.count))}l.clearUpdateRanges()}u.count!==-1&&(t?n.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count):n.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h.subarray(u.offset,u.offset+u.count)),u.count=-1),l.onUploadCallback()})(a.buffer,r,s),a.version=r.version}}}}var hi=class n extends tt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,u=e/o,d=t/l,p=[],m=[],x=[],f=[];for(let y=0;y<h;y++){let v=y*d-a;for(let g=0;g<c;g++){let w=g*u-s;m.push(w,-v,0),x.push(0,0,1),f.push(g/o),f.push(1-y/l)}}for(let y=0;y<l;y++)for(let v=0;v<o;v++){let g=v+c*y,w=v+c*(y+1),b=v+1+c*(y+1),_=v+1+c*y;p.push(g,w,_),p.push(w,b,_)}this.setIndex(p),this.setAttribute("position",new _e(m,3)),this.setAttribute("normal",new _e(x,3)),this.setAttribute("uv",new _e(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Oe={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},de={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new k(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new k(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},kn={basic:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new he(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:on([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:on([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new he(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:on([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:on([de.points,de.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:on([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:on([de.common,de.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:on([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:on([de.sprite,de.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:on([de.common,de.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:on([de.lights,de.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};kn.physical={uniforms:on([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new k(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new k},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new k},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};var _a={r:0,b:0,g:0};function mf(n,e,t,i,r,s,a){let o=new he(0),l,c,h=s===!0?0:1,u=null,d=0,p=null;function m(x,f){x.getRGB(_a,hd(n)),i.buffers.color.setClear(_a.r,_a.g,_a.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(x,f=1){o.set(x),h=f,m(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(x){h=x,m(o,h)},render:function(x,f){let y=!1,v=f.isScene===!0?f.background:null;v&&v.isTexture&&(v=(f.backgroundBlurriness>0?t:e).get(v)),v===null?m(o,h):v&&v.isColor&&(m(v,1),y=!0);let g=n.xr.getEnvironmentBlendMode();g==="additive"?i.buffers.color.setClear(0,0,0,1,a):g==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),v&&(v.isCubeTexture||v.mapping===yo)?(c===void 0&&(c=new Je(new we(1,1,1),new He({name:"BackgroundCubeMaterial",uniforms:qr(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:Tt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,b,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=dt.getTransfer(v.colorSpace)!==gt,u===v&&d===v.version&&p===n.toneMapping||(c.material.needsUpdate=!0,u=v,d=v.version,p=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Je(new hi(2,2),new He({name:"BackgroundMaterial",uniforms:qr(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=dt.getTransfer(v.colorSpace)!==gt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),u===v&&d===v.version&&p===n.toneMapping||(l.material.needsUpdate=!0,u=v,d=v.version,p=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}}}function gf(n,e,t,i){let r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=p(null),c=l,h=!1;function u(b){return i.isWebGL2?n.bindVertexArray(b):s.bindVertexArrayOES(b)}function d(b){return i.isWebGL2?n.deleteVertexArray(b):s.deleteVertexArrayOES(b)}function p(b){let _=[],M=[],P=[];for(let R=0;R<r;R++)_[R]=0,M[R]=0,P[R]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:_,enabledAttributes:M,attributeDivisors:P,object:b,attributes:{},index:null}}function m(){let b=c.newAttributes;for(let _=0,M=b.length;_<M;_++)b[_]=0}function x(b){f(b,0)}function f(b,_){let M=c.newAttributes,P=c.enabledAttributes,R=c.attributeDivisors;M[b]=1,P[b]===0&&(n.enableVertexAttribArray(b),P[b]=1),R[b]!==_&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](b,_),R[b]=_)}function y(){let b=c.newAttributes,_=c.enabledAttributes;for(let M=0,P=_.length;M<P;M++)_[M]!==b[M]&&(n.disableVertexAttribArray(M),_[M]=0)}function v(b,_,M,P,R,I,N){N===!0?n.vertexAttribIPointer(b,_,M,R,I):n.vertexAttribPointer(b,_,M,P,R,I)}function g(){w(),h=!0,c!==l&&(c=l,u(c.object))}function w(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:function(b,_,M,P,R){let I=!1;if(a){let N=(function(C,z,O){let q=O.wireframe===!0,le=o[C.id];le===void 0&&(le={},o[C.id]=le);let J=le[z.id];J===void 0&&(J={},le[z.id]=J);let Z=J[q];return Z===void 0&&(Z=p(i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()),J[q]=Z),Z})(P,M,_);c!==N&&(c=N,u(c.object)),I=(function(C,z,O,q){let le=c.attributes,J=z.attributes,Z=0,$=O.getAttributes();for(let U in $)if($[U].location>=0){let V=le[U],te=J[U];if(te===void 0&&(U==="instanceMatrix"&&C.instanceMatrix&&(te=C.instanceMatrix),U==="instanceColor"&&C.instanceColor&&(te=C.instanceColor)),V===void 0||V.attribute!==te||te&&V.data!==te.data)return!0;Z++}return c.attributesNum!==Z||c.index!==q})(b,P,M,R),I&&(function(C,z,O,q){let le={},J=z.attributes,Z=0,$=O.getAttributes();for(let U in $)if($[U].location>=0){let V=J[U];V===void 0&&(U==="instanceMatrix"&&C.instanceMatrix&&(V=C.instanceMatrix),U==="instanceColor"&&C.instanceColor&&(V=C.instanceColor));let te={};te.attribute=V,V&&V.data&&(te.data=V.data),le[U]=te,Z++}c.attributes=le,c.attributesNum=Z,c.index=q})(b,P,M,R)}else{let N=_.wireframe===!0;c.geometry===P.id&&c.program===M.id&&c.wireframe===N||(c.geometry=P.id,c.program=M.id,c.wireframe=N,I=!0)}R!==null&&t.update(R,n.ELEMENT_ARRAY_BUFFER),(I||h)&&(h=!1,(function(N,C,z,O){if(i.isWebGL2===!1&&(N.isInstancedMesh||O.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;m();let q=O.attributes,le=z.getAttributes(),J=C.defaultAttributeValues;for(let Z in le){let $=le[Z];if($.location>=0){let U=q[Z];if(U===void 0&&(Z==="instanceMatrix"&&N.instanceMatrix&&(U=N.instanceMatrix),Z==="instanceColor"&&N.instanceColor&&(U=N.instanceColor)),U!==void 0){let V=U.normalized,te=U.itemSize,A=t.get(U);if(A===void 0)continue;let S=A.buffer,G=A.type,ee=A.bytesPerElement,L=i.isWebGL2===!0&&(G===n.INT||G===n.UNSIGNED_INT||U.gpuType===ed);if(U.isInterleavedBufferAttribute){let Q=U.data,F=Q.stride,H=U.offset;if(Q.isInstancedInterleavedBuffer){for(let W=0;W<$.locationSize;W++)f($.location+W,Q.meshPerAttribute);N.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let W=0;W<$.locationSize;W++)x($.location+W);n.bindBuffer(n.ARRAY_BUFFER,S);for(let W=0;W<$.locationSize;W++)v($.location+W,te/$.locationSize,G,V,F*ee,(H+te/$.locationSize*W)*ee,L)}else{if(U.isInstancedBufferAttribute){for(let Q=0;Q<$.locationSize;Q++)f($.location+Q,U.meshPerAttribute);N.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=U.meshPerAttribute*U.count)}else for(let Q=0;Q<$.locationSize;Q++)x($.location+Q);n.bindBuffer(n.ARRAY_BUFFER,S);for(let Q=0;Q<$.locationSize;Q++)v($.location+Q,te/$.locationSize,G,V,te*ee,te/$.locationSize*Q*ee,L)}}else if(J!==void 0){let V=J[Z];if(V!==void 0)switch(V.length){case 2:n.vertexAttrib2fv($.location,V);break;case 3:n.vertexAttrib3fv($.location,V);break;case 4:n.vertexAttrib4fv($.location,V);break;default:n.vertexAttrib1fv($.location,V)}}}}y()})(b,_,M,P),R!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(R).buffer))},reset:g,resetDefaultState:w,dispose:function(){g();for(let b in o){let _=o[b];for(let M in _){let P=_[M];for(let R in P)d(P[R].object),delete P[R];delete _[M]}delete o[b]}},releaseStatesOfGeometry:function(b){if(o[b.id]===void 0)return;let _=o[b.id];for(let M in _){let P=_[M];for(let R in P)d(P[R].object),delete P[R];delete _[M]}delete o[b.id]},releaseStatesOfProgram:function(b){for(let _ in o){let M=o[_];if(M[b.id]===void 0)continue;let P=M[b.id];for(let R in P)d(P[R].object),delete P[R];delete M[b.id]}},initAttributes:m,enableAttribute:x,disableUnusedAttributes:y}}function vf(n,e,t,i){let r=i.isWebGL2,s;this.setMode=function(a){s=a},this.render=function(a,o){n.drawArrays(s,a,o),t.update(o,s,1)},this.renderInstances=function(a,o,l){if(l===0)return;let c,h;if(r)c=n,h="drawArraysInstanced";else if(c=e.get("ANGLE_instanced_arrays"),h="drawArraysInstancedANGLE",c===null)return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");c[h](s,a,o,l),t.update(o,s,l)},this.renderMultiDraw=function(a,o,l){if(l===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<l;h++)this.render(a[h],o[h]);else{c.multiDrawArraysWEBGL(s,a,0,o,0,l);let h=0;for(let u=0;u<l;u++)h+=o[u];t.update(h,s,1)}}}function xf(n,e,t){let i;function r(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let s=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",o=r(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=s||e.has("WEBGL_draw_buffers"),c=t.logarithmicDepthBuffer===!0,h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),u=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),f=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),v=u>0,g=s||e.has("OES_texture_float");return{isWebGL2:s,drawBuffers:l,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:r,precision:a,logarithmicDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:f,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:g,floatVertexTextures:v&&g,maxSamples:s?n.getParameter(n.MAX_SAMPLES):0}}function yf(n){let e=this,t=null,i=0,r=!1,s=!1,a=new Nn,o=new Ve,l={value:null,needsUpdate:!1};function c(h,u,d,p){let m=h!==null?h.length:0,x=null;if(m!==0){if(x=l.value,p!==!0||x===null){let f=d+4*m,y=u.matrixWorldInverse;o.getNormalMatrix(y),(x===null||x.length<f)&&(x=new Float32Array(f));for(let v=0,g=d;v!==m;++v,g+=4)a.copy(h[v]).applyMatrix4(y,o),a.normal.toArray(x,g),x[g+3]=a.constant}l.value=x,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,x}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||i!==0||r;return r=u,i=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let p=h.clippingPlanes,m=h.clipIntersection,x=h.clipShadows,f=n.get(h);if(!r||p===null||p.length===0||s&&!x)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0})();else{let y=s?0:i,v=4*y,g=f.clippingState||null;l.value=g,g=c(p,u,v,d);for(let w=0;w!==v;++w)g[w]=t[w];f.clippingState=g,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=y}}}function Ef(n){let e=new WeakMap;function t(r,s){return s===Ol?r.mapping=Yr:s===Fl&&(r.mapping=jr),r}function i(r){let s=r.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping;if(s===Ol||s===Fl){if(e.has(r))return t(e.get(r).texture,r.mapping);{let a=r.image;if(a&&a.height>0){let o=new Yl(a.height/2);return o.fromEquirectangularTexture(n,r),e.set(r,o),r.addEventListener("dispose",i),t(o.texture,r.mapping)}return null}}}return r},dispose:function(){e=new WeakMap}}}var to=class extends nr{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},gu=[.125,.215,.35,.446,.526,.582],vs=20,wl=new to,vu=new he,Al=null,Sl=0,_l=0,Qi=(1+Math.sqrt(5))/2,Nr=1/Qi,xu=[new E(1,1,1),new E(-1,1,1),new E(1,1,-1),new E(-1,1,-1),new E(0,Qi,Nr),new E(0,Qi,-Nr),new E(Nr,0,Qi),new E(-Nr,0,Qi),new E(Qi,Nr,0),new E(-Qi,Nr,0)],no=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Al=this._renderer.getRenderTarget(),Sl=this._renderer.getActiveCubeFace(),_l=this._renderer.getActiveMipmapLevel(),this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Al,Sl,_l),e.scissorTest=!1,Ta(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yr||e.mapping===jr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Al=this._renderer.getRenderTarget(),Sl=this._renderer.getActiveCubeFace(),_l=this._renderer.getActiveMipmapLevel();let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Pt,minFilter:Pt,generateMipmaps:!1,type:tr,format:un,colorSpace:fn,depthBuffer:!1},r=yu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yu(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(a){let o=[],l=[],c=[],h=a,u=a-4+1+gu.length;for(let d=0;d<u;d++){let p=Math.pow(2,h);l.push(p);let m=1/p;d>a-4?m=gu[d-a+4-1]:d===0&&(m=0),c.push(m);let x=1/(p-2),f=-x,y=1+x,v=[f,f,y,f,y,y,f,f,y,y,f,y],g=6,w=6,b=3,_=2,M=1,P=new Float32Array(b*w*g),R=new Float32Array(_*w*g),I=new Float32Array(M*w*g);for(let C=0;C<g;C++){let z=C%3*2/3-1,O=C>2?0:-1,q=[z,O,0,z+2/3,O,0,z+2/3,O+1,0,z,O,0,z+2/3,O+1,0,z,O+1,0];P.set(q,b*w*C),R.set(v,_*w*C);let le=[C,C,C,C,C,C];I.set(le,M*w*C)}let N=new tt;N.setAttribute("position",new Ut(P,b)),N.setAttribute("uv",new Ut(R,_)),N.setAttribute("faceIndex",new Ut(I,M)),o.push(N),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(a,o,l){let c=new Float32Array(vs),h=new E(0,1,0);return new He({name:"SphericalGaussianBlur",defines:{n:vs,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return r}_compileMaterial(e){let t=new Je(this._lodPlanes[0],e);this._renderer.compile(t,wl)}_sceneToCubeUV(e,t,i,r){let s=new At(90,1,t,i),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(vu),l.toneMapping=Ai,l.autoClear=!1;let u=new Xt({name:"PMREM.Background",side:Tt,depthWrite:!1,depthTest:!1}),d=new Je(new we,u),p=!1,m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,p=!0):(u.color.copy(vu),p=!0);for(let x=0;x<6;x++){let f=x%3;f===0?(s.up.set(0,a[x],0),s.lookAt(o[x],0,0)):f===1?(s.up.set(0,0,a[x]),s.lookAt(0,o[x],0)):(s.up.set(0,a[x],0),s.lookAt(0,0,o[x]));let y=this._cubeSize;Ta(r,f*y,x>2?y:0,y,y),l.setRenderTarget(r),p&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===Yr||e.mapping===jr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eu());let s=r?this._cubemapMaterial:this._equirectMaterial,a=new Je(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;Ta(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,wl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){let s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=xu[(r-1)%xu.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,r,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Je(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,m=s/p,x=isFinite(s)?1+Math.floor(3*m):vs;x>vs&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${x} samples when the maximum is set to 20`);let f=[],y=0;for(let w=0;w<vs;++w){let b=w/m,_=Math.exp(-b*b/2);f.push(_),w===0?y+=_:w<x&&(y+=2*_)}for(let w=0;w<f.length;w++)f[w]=f[w]/y;u.envMap.value=e.texture,u.samples.value=x,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:v}=this;u.dTheta.value=p,u.mipInt.value=v-i;let g=this._sizeLods[r];Ta(t,3*g*(r>v-4?r-v+4:0),4*(this._cubeSize-g),3*g,2*g),l.setRenderTarget(t),l.render(h,wl)}};function yu(n,e,t){let i=new Fe(n,e,t);return i.texture.mapping=yo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ta(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Eu(){return new He({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Mu(){return new He({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Uc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Mf(n){let e=new WeakMap,t=null;function i(r){let s=r.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping,a=s===Ol||s===Fl,o=s===Yr||s===jr;if(a||o){if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let l=e.get(r);return t===null&&(t=new no(n)),l=a?t.fromEquirectangular(r,l):t.fromCubemap(r,l),e.set(r,l),l.texture}if(e.has(r))return e.get(r).texture;{let l=r.image;if(a&&l&&l.height>0||o&&l&&(function(c){let h=0,u=6;for(let d=0;d<u;d++)c[d]!==void 0&&h++;return h===u})(l)){t===null&&(t=new no(n));let c=a?t.fromEquirectangular(r):t.fromCubemap(r);return e.set(r,c),r.addEventListener("dispose",i),c.texture}return null}}}return r},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function wf(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){let r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Af(n,e,t,i){let r={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let p=0,m=d.length;p<m;p++)e.remove(d[p])}c.removeEventListener("dispose",a),delete r[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),i.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let x=h.array;d=h.version;for(let f=0,y=x.length;f<y;f+=3){let v=x[f+0],g=x[f+1],w=x[f+2];c.push(v,g,g,w,w,v)}}else{if(u===void 0)return;{let x=u.array;d=u.version;for(let f=0,y=x.length/3-1;f<y;f+=3){let v=f+0,g=f+1,w=f+2;c.push(v,g,g,w,w,v)}}}let p=new(ld(c)?$a:Ja)(c,1);p.version=d;let m=s.get(l);m&&e.remove(m),s.set(l,p)}return{get:function(l,c){return r[c.id]===!0||(c.addEventListener("dispose",a),r[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],n.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let p=0,m=d.length;p<m;p++)e.update(d[p],n.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function Sf(n,e,t,i){let r=i.isWebGL2,s,a,o;this.setMode=function(l){s=l},this.setIndex=function(l){a=l.type,o=l.bytesPerElement},this.render=function(l,c){n.drawElements(s,c,a,l*o),t.update(c,s,1)},this.renderInstances=function(l,c,h){if(h===0)return;let u,d;if(r)u=n,d="drawElementsInstanced";else if(u=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",u===null)return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");u[d](s,c,a,l*o,h),t.update(c,s,h)},this.renderMultiDraw=function(l,c,h){if(h===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<h;d++)this.render(l[d]/o,c[d]);else{u.multiDrawElementsWEBGL(s,c,0,a,l,0,h);let d=0;for(let p=0;p<h;p++)d+=c[p];t.update(d,s,1)}}}function _f(n){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,r){switch(e.calls++,i){case n.TRIANGLES:e.triangles+=r*(t/3);break;case n.LINES:e.lines+=r*(t/2);break;case n.LINE_STRIP:e.lines+=r*(t-1);break;case n.LINE_LOOP:e.lines+=r*t;break;case n.POINTS:e.points+=r*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function Tf(n,e){return n[0]-e[0]}function bf(n,e){return Math.abs(e[1])-Math.abs(n[1])}function Cf(n,e,t){let i={},r=new Float32Array(8),s=new WeakMap,a=new et,o=[];for(let l=0;l<8;l++)o[l]=[l,0];return{update:function(l,c,h){let u=l.morphTargetInfluences;if(e.isWebGL2===!0){let d=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,p=d!==void 0?d.length:0,m=s.get(c);if(m===void 0||m.count!==p){let z=function(){N.dispose(),s.delete(c),c.removeEventListener("dispose",z)};m!==void 0&&m.texture.dispose();let y=c.morphAttributes.position!==void 0,v=c.morphAttributes.normal!==void 0,g=c.morphAttributes.color!==void 0,w=c.morphAttributes.position||[],b=c.morphAttributes.normal||[],_=c.morphAttributes.color||[],M=0;y===!0&&(M=1),v===!0&&(M=2),g===!0&&(M=3);let P=c.attributes.position.count*M,R=1;P>e.maxTextureSize&&(R=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);let I=new Float32Array(P*R*4*p),N=new Qa(I,P,R,p);N.type=pn,N.needsUpdate=!0;let C=4*M;for(let O=0;O<p;O++){let q=w[O],le=b[O],J=_[O],Z=P*R*4*O;for(let $=0;$<q.count;$++){let U=$*C;y===!0&&(a.fromBufferAttribute(q,$),I[Z+U+0]=a.x,I[Z+U+1]=a.y,I[Z+U+2]=a.z,I[Z+U+3]=0),v===!0&&(a.fromBufferAttribute(le,$),I[Z+U+4]=a.x,I[Z+U+5]=a.y,I[Z+U+6]=a.z,I[Z+U+7]=0),g===!0&&(a.fromBufferAttribute(J,$),I[Z+U+8]=a.x,I[Z+U+9]=a.y,I[Z+U+10]=a.z,I[Z+U+11]=J.itemSize===4?a.w:1)}}m={count:p,texture:N,size:new k(P,R)},s.set(c,m),c.addEventListener("dispose",z)}let x=0;for(let y=0;y<u.length;y++)x+=u[y];let f=c.morphTargetsRelative?1:1-x;h.getUniforms().setValue(n,"morphTargetBaseInfluence",f),h.getUniforms().setValue(n,"morphTargetInfluences",u),h.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),h.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}else{let d=u===void 0?0:u.length,p=i[c.id];if(p===void 0||p.length!==d){p=[];for(let v=0;v<d;v++)p[v]=[v,0];i[c.id]=p}for(let v=0;v<d;v++){let g=p[v];g[0]=v,g[1]=u[v]}p.sort(bf);for(let v=0;v<8;v++)v<d&&p[v][1]?(o[v][0]=p[v][0],o[v][1]=p[v][1]):(o[v][0]=Number.MAX_SAFE_INTEGER,o[v][1]=0);o.sort(Tf);let m=c.morphAttributes.position,x=c.morphAttributes.normal,f=0;for(let v=0;v<8;v++){let g=o[v],w=g[0],b=g[1];w!==Number.MAX_SAFE_INTEGER&&b?(m&&c.getAttribute("morphTarget"+v)!==m[w]&&c.setAttribute("morphTarget"+v,m[w]),x&&c.getAttribute("morphNormal"+v)!==x[w]&&c.setAttribute("morphNormal"+v,x[w]),r[v]=b,f+=b):(m&&c.hasAttribute("morphTarget"+v)===!0&&c.deleteAttribute("morphTarget"+v),x&&c.hasAttribute("morphNormal"+v)===!0&&c.deleteAttribute("morphNormal"+v),r[v]=0)}let y=c.morphTargetsRelative?1:1-f;h.getUniforms().setValue(n,"morphTargetBaseInfluence",y),h.getUniforms().setValue(n,"morphTargetInfluences",r)}}}}function Rf(n,e,t,i){let r=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,l=a.geometry,c=e.get(a,l);if(r.get(c)!==o&&(e.update(c),r.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),r.get(a)!==o&&(t.update(a.instanceMatrix,n.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,n.ARRAY_BUFFER),r.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;r.get(h)!==o&&(h.update(),r.set(h,o))}return c},dispose:function(){r=new WeakMap}}}var ir=class extends Vt{constructor(e,t,i,r,s,a,o,l,c,h){if((h=h!==void 0?h:$i)!==$i&&h!==_i)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===$i&&(i=Xn),i===void 0&&h===_i&&(i=ci),super(null,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:wt,this.minFilter=l!==void 0?l:wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},dd=new Vt,pd=new ir(1,1);pd.compareFunction=515;var fd=new Qa,md=new Ds,gd=new eo,wu=[],Au=[],Su=new Float32Array(16),_u=new Float32Array(9),Tu=new Float32Array(4);function ts(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=wu[r];if(s===void 0&&(s=new Float32Array(r),wu[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Nt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ot(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Mo(n,e){let t=Au[e];t===void 0&&(t=new Int32Array(e),Au[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Df(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Pf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2fv(this.addr,e),Ot(t,e)}}function If(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;n.uniform3fv(this.addr,e),Ot(t,e)}}function Lf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4fv(this.addr,e),Ot(t,e)}}function Bf(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,i))return;Tu.set(i),n.uniformMatrix2fv(this.addr,!1,Tu),Ot(t,i)}}function Uf(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,i))return;_u.set(i),n.uniformMatrix3fv(this.addr,!1,_u),Ot(t,i)}}function Nf(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,i))return;Su.set(i),n.uniformMatrix4fv(this.addr,!1,Su),Ot(t,i)}}function Of(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ff(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2iv(this.addr,e),Ot(t,e)}}function Hf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3iv(this.addr,e),Ot(t,e)}}function zf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4iv(this.addr,e),Ot(t,e)}}function Gf(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function kf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2uiv(this.addr,e),Ot(t,e)}}function Vf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3uiv(this.addr,e),Ot(t,e)}}function Wf(n,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4uiv(this.addr,e),Ot(t,e)}}function Xf(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s=this.type===n.SAMPLER_2D_SHADOW?pd:dd;t.setTexture2D(e||s,r)}function Yf(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||md,r)}function jf(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||gd,r)}function Zf(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||fd,r)}function Qf(n,e){n.uniform1fv(this.addr,e)}function qf(n,e){let t=ts(e,this.size,2);n.uniform2fv(this.addr,t)}function Kf(n,e){let t=ts(e,this.size,3);n.uniform3fv(this.addr,t)}function Jf(n,e){let t=ts(e,this.size,4);n.uniform4fv(this.addr,t)}function $f(n,e){let t=ts(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function e0(n,e){let t=ts(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function t0(n,e){let t=ts(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function n0(n,e){n.uniform1iv(this.addr,e)}function i0(n,e){n.uniform2iv(this.addr,e)}function r0(n,e){n.uniform3iv(this.addr,e)}function s0(n,e){n.uniform4iv(this.addr,e)}function a0(n,e){n.uniform1uiv(this.addr,e)}function o0(n,e){n.uniform2uiv(this.addr,e)}function l0(n,e){n.uniform3uiv(this.addr,e)}function c0(n,e){n.uniform4uiv(this.addr,e)}function h0(n,e,t){let i=this.cache,r=e.length,s=Mo(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||dd,s[a])}function u0(n,e,t){let i=this.cache,r=e.length,s=Mo(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||md,s[a])}function d0(n,e,t){let i=this.cache,r=e.length,s=Mo(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||gd,s[a])}function p0(n,e,t){let i=this.cache,r=e.length,s=Mo(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||fd,s[a])}var jl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=(function(r){switch(r){case 5126:return Df;case 35664:return Pf;case 35665:return If;case 35666:return Lf;case 35674:return Bf;case 35675:return Uf;case 35676:return Nf;case 5124:case 35670:return Of;case 35667:case 35671:return Ff;case 35668:case 35672:return Hf;case 35669:case 35673:return zf;case 5125:return Gf;case 36294:return kf;case 36295:return Vf;case 36296:return Wf;case 35678:case 36198:case 36298:case 36306:case 35682:return Xf;case 35679:case 36299:case 36307:return Yf;case 35680:case 36300:case 36308:case 36293:return jf;case 36289:case 36303:case 36311:case 36292:return Zf}})(t.type)}},Zl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(r){switch(r){case 5126:return Qf;case 35664:return qf;case 35665:return Kf;case 35666:return Jf;case 35674:return $f;case 35675:return e0;case 35676:return t0;case 5124:case 35670:return n0;case 35667:case 35671:return i0;case 35668:case 35672:return r0;case 35669:case 35673:return s0;case 5125:return a0;case 36294:return o0;case 36295:return l0;case 36296:return c0;case 35678:case 36198:case 36298:case 36306:case 35682:return h0;case 35679:case 36299:case 36307:return u0;case 35680:case 36300:case 36308:case 36293:return d0;case 36289:case 36303:case 36311:case 36292:return p0}})(t.type)}},Ql=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],i)}}},Tl=/(\w+)(\])?(\[|\.)?/g;function bu(n,e){n.seq.push(e),n.map[e.id]=e}function f0(n,e,t){let i=n.name,r=i.length;for(Tl.lastIndex=0;;){let s=Tl.exec(i),a=Tl.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===r){bu(t,c===void 0?new jl(o,n,e):new Zl(o,n,e));break}{let h=t.map[o];h===void 0&&(h=new Ql(o),bu(t,h)),t=h}}}var Xr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let s=e.getActiveUniform(t,r);f0(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&i.push(a)}return i}};function Cu(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var m0=37297,g0=0;function Ru(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+(function(o,l){let c=o.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let p=u;p<d;p++){let m=p+1;h.push(`${m===l?">":" "} ${m}: ${c[p]}`)}return h.join(`
`)})(n.getShaderSource(e),a)}return r}function v0(n,e){let t=(function(i){let r=dt.getPrimaries(dt.workingColorSpace),s=dt.getPrimaries(i),a;switch(r===s?a="":r===Va&&s===ka?a="LinearDisplayP3ToLinearSRGB":r===ka&&s===Va&&(a="LinearSRGBToLinearDisplayP3"),i){case fn:case Eo:return[a,"LinearTransferOETF"];case Ae:case Bc:return[a,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[a,"LinearTransferOETF"]}})(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function x0(n,e){let t;switch(e){case Vp:t="Linear";break;case Wp:t="Reinhard";break;case Xp:t="OptimizedCineon";break;case Ic:t="ACESFilmic";break;case jp:t="AgX";break;case Yp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Or(n){return n!==""}function Du(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var y0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ql(n){return n.replace(y0,M0)}var E0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function M0(n,e){let t=Oe[e];if(t===void 0){let i=E0.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Oe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return ql(t)}var w0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Iu(n){return n.replace(w0,A0)}function A0(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Lu(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function S0(n,e,t,i){let r=n.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=(function(C){let z="SHADOWMAP_TYPE_BASIC";return C.shadowMapType===Ku?z="SHADOWMAP_TYPE_PCF":C.shadowMapType===Dc?z="SHADOWMAP_TYPE_PCF_SOFT":C.shadowMapType===li&&(z="SHADOWMAP_TYPE_VSM"),z})(t),c=(function(C){let z="ENVMAP_TYPE_CUBE";if(C.envMap)switch(C.envMapMode){case Yr:case jr:z="ENVMAP_TYPE_CUBE";break;case yo:z="ENVMAP_TYPE_CUBE_UV"}return z})(t),h=(function(C){let z="ENVMAP_MODE_REFLECTION";return C.envMap&&C.envMapMode===jr&&(z="ENVMAP_MODE_REFRACTION"),z})(t),u=(function(C){let z="ENVMAP_BLENDING_NONE";if(C.envMap)switch(C.combine){case Ju:z="ENVMAP_BLENDING_MULTIPLY";break;case Gp:z="ENVMAP_BLENDING_MIX";break;case kp:z="ENVMAP_BLENDING_ADD"}return z})(t),d=(function(C){let z=C.envMapCubeUVHeight;if(z===null)return null;let O=Math.log2(z)-2,q=1/z;return{texelWidth:1/(3*Math.max(Math.pow(2,O),112)),texelHeight:q,maxMip:O}})(t),p=t.isWebGL2?"":(function(C){return[C.extensionDerivatives||C.envMapCubeUVHeight||C.bumpMap||C.normalMapTangentSpace||C.clearcoatNormalMap||C.flatShading||C.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(C.extensionFragDepth||C.logarithmicDepthBuffer)&&C.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",C.extensionDrawBuffers&&C.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(C.extensionShaderTextureLOD||C.envMap||C.transmission)&&C.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Or).join(`
`)})(t),m=(function(C){return[C.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Or).join(`
`)})(t),x=(function(C){let z=[];for(let O in C){let q=C[O];q!==!1&&z.push("#define "+O+" "+q)}return z.join(`
`)})(s),f=r.createProgram(),y,v,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Or).join(`
`),y.length>0&&(y+=`
`),v=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Or).join(`
`),v.length>0&&(v+=`
`)):(y=[Lu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Or).join(`
`),v=[p,Lu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ai?"#define TONE_MAPPING":"",t.toneMapping!==Ai?Oe.tonemapping_pars_fragment:"",t.toneMapping!==Ai?x0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,v0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Or).join(`
`)),a=ql(a),a=Du(a,t),a=Pu(a,t),o=ql(o),o=Du(o,t),o=Pu(o,t),a=Iu(a),o=Iu(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,y=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,v=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Jh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let w=g+y+a,b=g+v+o,_=Cu(r,r.VERTEX_SHADER,w),M=Cu(r,r.FRAGMENT_SHADER,b);function P(C){if(n.debug.checkShaderErrors){let z=r.getProgramInfoLog(f).trim(),O=r.getShaderInfoLog(_).trim(),q=r.getShaderInfoLog(M).trim(),le=!0,J=!0;if(r.getProgramParameter(f,r.LINK_STATUS)===!1)if(le=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,f,_,M);else{let Z=Ru(r,_,"vertex"),$=Ru(r,M,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(f,r.VALIDATE_STATUS)+`

Program Info Log: `+z+`
`+Z+`
`+$)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):O!==""&&q!==""||(J=!1);J&&(C.diagnostics={runnable:le,programLog:z,vertexShader:{log:O,prefix:y},fragmentShader:{log:q,prefix:v}})}r.deleteShader(_),r.deleteShader(M),R=new Xr(r,f),I=(function(z,O){let q={},le=z.getProgramParameter(O,z.ACTIVE_ATTRIBUTES);for(let J=0;J<le;J++){let Z=z.getActiveAttrib(O,J),$=Z.name,U=1;Z.type===z.FLOAT_MAT2&&(U=2),Z.type===z.FLOAT_MAT3&&(U=3),Z.type===z.FLOAT_MAT4&&(U=4),q[$]={type:Z.type,location:z.getAttribLocation(O,$),locationSize:U}}return q})(r,f)}let R,I;r.attachShader(f,_),r.attachShader(f,M),t.index0AttributeName!==void 0?r.bindAttribLocation(f,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(f,0,"position"),r.linkProgram(f),this.getUniforms=function(){return R===void 0&&P(this),R},this.getAttributes=function(){return I===void 0&&P(this),I};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=r.getProgramParameter(f,m0)),N},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(f),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=g0++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=_,this.fragmentShader=M,this}var _0=0,Kl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Jl(e),t.set(e,i)),i}},Jl=class{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}};function T0(n,e,t,i,r,s,a){let o=new Ka,l=new Kl,c=[],h=r.isWebGL2,u=r.logarithmicDepthBuffer,d=r.vertexTextures,p=r.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(f){return f===0?"uv":`uv${f}`}return{getParameters:function(f,y,v,g,w){let b=g.fog,_=w.geometry,M=f.isMeshStandardMaterial?g.environment:null,P=(f.isMeshStandardMaterial?t:e).get(f.envMap||M),R=P&&P.mapping===yo?P.image.height:null,I=m[f.type];f.precision!==null&&(p=r.getMaxPrecision(f.precision),p!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",p,"instead."));let N=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,C=N!==void 0?N.length:0,z,O,q,le,J=0;if(_.morphAttributes.position!==void 0&&(J=1),_.morphAttributes.normal!==void 0&&(J=2),_.morphAttributes.color!==void 0&&(J=3),I){let kt=kn[I];z=kt.vertexShader,O=kt.fragmentShader}else z=f.vertexShader,O=f.fragmentShader,l.update(f),q=l.getVertexShaderID(f),le=l.getFragmentShaderID(f);let Z=n.getRenderTarget(),$=w.isInstancedMesh===!0,U=w.isBatchedMesh===!0,V=!!f.map,te=!!f.matcap,A=!!P,S=!!f.aoMap,G=!!f.lightMap,ee=!!f.bumpMap,L=!!f.normalMap,Q=!!f.displacementMap,F=!!f.emissiveMap,H=!!f.metalnessMap,W=!!f.roughnessMap,re=f.anisotropy>0,ne=f.clearcoat>0,T=f.iridescence>0,ae=f.sheen>0,Y=f.transmission>0,j=re&&!!f.anisotropyMap,oe=ne&&!!f.clearcoatMap,pe=ne&&!!f.clearcoatNormalMap,fe=ne&&!!f.clearcoatRoughnessMap,xe=T&&!!f.iridescenceMap,Re=T&&!!f.iridescenceThicknessMap,ve=ae&&!!f.sheenColorMap,ye=ae&&!!f.sheenRoughnessMap,Ue=!!f.specularMap,Rt=!!f.specularColorMap,Se=!!f.specularIntensityMap,Ye=Y&&!!f.transmissionMap,Ge=Y&&!!f.thicknessMap,Hi=!!f.gradientMap,xn=!!f.alphaMap,B=f.alphaTest>0,ge=!!f.alphaHash,Le=!!f.extensions,Ke=!!_.attributes.uv1,X=!!_.attributes.uv2,yn=!!_.attributes.uv3,Ft=Ai;return f.toneMapped&&(Z!==null&&Z.isXRRenderTarget!==!0||(Ft=n.toneMapping)),{isWebGL2:h,shaderID:I,shaderType:f.type,shaderName:f.name,vertexShader:z,fragmentShader:O,defines:f.defines,customVertexShaderID:q,customFragmentShaderID:le,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:p,batching:U,instancing:$,instancingColor:$&&w.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:fn,map:V,matcap:te,envMap:A,envMapMode:A&&P.mapping,envMapCubeUVHeight:R,aoMap:S,lightMap:G,bumpMap:ee,normalMap:L,displacementMap:d&&Q,emissiveMap:F,normalMapObjectSpace:L&&f.normalMapType===1,normalMapTangentSpace:L&&f.normalMapType===0,metalnessMap:H,roughnessMap:W,anisotropy:re,anisotropyMap:j,clearcoat:ne,clearcoatMap:oe,clearcoatNormalMap:pe,clearcoatRoughnessMap:fe,iridescence:T,iridescenceMap:xe,iridescenceThicknessMap:Re,sheen:ae,sheenColorMap:ve,sheenRoughnessMap:ye,specularMap:Ue,specularColorMap:Rt,specularIntensityMap:Se,transmission:Y,transmissionMap:Ye,thicknessMap:Ge,gradientMap:Hi,opaque:f.transparent===!1&&f.blending===1,alphaMap:xn,alphaTest:B,alphaHash:ge,combine:f.combine,mapUv:V&&x(f.map.channel),aoMapUv:S&&x(f.aoMap.channel),lightMapUv:G&&x(f.lightMap.channel),bumpMapUv:ee&&x(f.bumpMap.channel),normalMapUv:L&&x(f.normalMap.channel),displacementMapUv:Q&&x(f.displacementMap.channel),emissiveMapUv:F&&x(f.emissiveMap.channel),metalnessMapUv:H&&x(f.metalnessMap.channel),roughnessMapUv:W&&x(f.roughnessMap.channel),anisotropyMapUv:j&&x(f.anisotropyMap.channel),clearcoatMapUv:oe&&x(f.clearcoatMap.channel),clearcoatNormalMapUv:pe&&x(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&x(f.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&x(f.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&x(f.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&x(f.sheenColorMap.channel),sheenRoughnessMapUv:ye&&x(f.sheenRoughnessMap.channel),specularMapUv:Ue&&x(f.specularMap.channel),specularColorMapUv:Rt&&x(f.specularColorMap.channel),specularIntensityMapUv:Se&&x(f.specularIntensityMap.channel),transmissionMapUv:Ye&&x(f.transmissionMap.channel),thicknessMapUv:Ge&&x(f.thicknessMap.channel),alphaMapUv:xn&&x(f.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(L||re),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,vertexUv1s:Ke,vertexUv2s:X,vertexUv3s:yn,pointsUvs:w.isPoints===!0&&!!_.attributes.uv&&(V||xn),fog:!!b,useFog:f.fog===!0,fogExp2:b&&b.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:w.isSkinnedMesh===!0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:C,morphTextureStride:J,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:n.shadowMap.enabled&&v.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ft,useLegacyLights:n._useLegacyLights,decodeVideoTexture:V&&f.map.isVideoTexture===!0&&dt.getTransfer(f.map.colorSpace)===gt,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===Tt,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionDerivatives:Le&&f.extensions.derivatives===!0,extensionFragDepth:Le&&f.extensions.fragDepth===!0,extensionDrawBuffers:Le&&f.extensions.drawBuffers===!0,extensionShaderTextureLOD:Le&&f.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Le&&f.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()}},getProgramCacheKey:function(f){let y=[];if(f.shaderID?y.push(f.shaderID):(y.push(f.customVertexShaderID),y.push(f.customFragmentShaderID)),f.defines!==void 0)for(let v in f.defines)y.push(v),y.push(f.defines[v]);return f.isRawShaderMaterial===!1&&((function(v,g){v.push(g.precision),v.push(g.outputColorSpace),v.push(g.envMapMode),v.push(g.envMapCubeUVHeight),v.push(g.mapUv),v.push(g.alphaMapUv),v.push(g.lightMapUv),v.push(g.aoMapUv),v.push(g.bumpMapUv),v.push(g.normalMapUv),v.push(g.displacementMapUv),v.push(g.emissiveMapUv),v.push(g.metalnessMapUv),v.push(g.roughnessMapUv),v.push(g.anisotropyMapUv),v.push(g.clearcoatMapUv),v.push(g.clearcoatNormalMapUv),v.push(g.clearcoatRoughnessMapUv),v.push(g.iridescenceMapUv),v.push(g.iridescenceThicknessMapUv),v.push(g.sheenColorMapUv),v.push(g.sheenRoughnessMapUv),v.push(g.specularMapUv),v.push(g.specularColorMapUv),v.push(g.specularIntensityMapUv),v.push(g.transmissionMapUv),v.push(g.thicknessMapUv),v.push(g.combine),v.push(g.fogExp2),v.push(g.sizeAttenuation),v.push(g.morphTargetsCount),v.push(g.morphAttributeCount),v.push(g.numDirLights),v.push(g.numPointLights),v.push(g.numSpotLights),v.push(g.numSpotLightMaps),v.push(g.numHemiLights),v.push(g.numRectAreaLights),v.push(g.numDirLightShadows),v.push(g.numPointLightShadows),v.push(g.numSpotLightShadows),v.push(g.numSpotLightShadowsWithMaps),v.push(g.numLightProbes),v.push(g.shadowMapType),v.push(g.toneMapping),v.push(g.numClippingPlanes),v.push(g.numClipIntersection),v.push(g.depthPacking)})(y,f),(function(v,g){o.disableAll(),g.isWebGL2&&o.enable(0),g.supportsVertexTextures&&o.enable(1),g.instancing&&o.enable(2),g.instancingColor&&o.enable(3),g.matcap&&o.enable(4),g.envMap&&o.enable(5),g.normalMapObjectSpace&&o.enable(6),g.normalMapTangentSpace&&o.enable(7),g.clearcoat&&o.enable(8),g.iridescence&&o.enable(9),g.alphaTest&&o.enable(10),g.vertexColors&&o.enable(11),g.vertexAlphas&&o.enable(12),g.vertexUv1s&&o.enable(13),g.vertexUv2s&&o.enable(14),g.vertexUv3s&&o.enable(15),g.vertexTangents&&o.enable(16),g.anisotropy&&o.enable(17),g.alphaHash&&o.enable(18),g.batching&&o.enable(19),v.push(o.mask),o.disableAll(),g.fog&&o.enable(0),g.useFog&&o.enable(1),g.flatShading&&o.enable(2),g.logarithmicDepthBuffer&&o.enable(3),g.skinning&&o.enable(4),g.morphTargets&&o.enable(5),g.morphNormals&&o.enable(6),g.morphColors&&o.enable(7),g.premultipliedAlpha&&o.enable(8),g.shadowMapEnabled&&o.enable(9),g.useLegacyLights&&o.enable(10),g.doubleSided&&o.enable(11),g.flipSided&&o.enable(12),g.useDepthPacking&&o.enable(13),g.dithering&&o.enable(14),g.transmission&&o.enable(15),g.sheen&&o.enable(16),g.opaque&&o.enable(17),g.pointsUvs&&o.enable(18),g.decodeVideoTexture&&o.enable(19),v.push(o.mask)})(y,f),y.push(n.outputColorSpace)),y.push(f.customProgramCacheKey),y.join()},getUniforms:function(f){let y=m[f.type],v;if(y){let g=kn[y];v=uf.clone(g.uniforms)}else v=f.uniforms;return v},acquireProgram:function(f,y){let v;for(let g=0,w=c.length;g<w;g++){let b=c[g];if(b.cacheKey===y){v=b,++v.usedTimes;break}}return v===void 0&&(v=new S0(n,y,f,s),c.push(v)),v},releaseProgram:function(f){if(--f.usedTimes==0){let y=c.indexOf(f);c[y]=c[c.length-1],c.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:c,dispose:function(){l.dispose()}}}function b0(){let n=new WeakMap;return{get:function(e){let t=n.get(e);return t===void 0&&(t={},n.set(e,t)),t},remove:function(e){n.delete(e)},update:function(e,t,i){n.get(e)[t]=i},dispose:function(){n=new WeakMap}}}function C0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Bu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Uu(){let n=[],e=0,t=[],i=[],r=[];function s(a,o,l,c,h,u){let d=n[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:u},n[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=l,d.groupOrder=c,d.renderOrder=a.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:i,transparent:r,init:function(){e=0,t.length=0,i.length=0,r.length=0},push:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?i.push(d):l.transparent===!0?r.push(d):t.push(d)},unshift:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?i.unshift(d):l.transparent===!0?r.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=n.length;a<o;a++){let l=n[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||C0),i.length>1&&i.sort(o||Bu),r.length>1&&r.sort(o||Bu)}}}function R0(){let n=new WeakMap;return{get:function(e,t){let i=n.get(e),r;return i===void 0?(r=new Uu,n.set(e,[r])):t>=i.length?(r=new Uu,i.push(r)):r=i[t],r},dispose:function(){n=new WeakMap}}}function D0(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new E,color:new he};break;case"SpotLight":t={position:new E,direction:new E,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new E,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new E,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new E,halfWidth:new E,halfHeight:new E}}return n[e.id]=t,t}}}var P0=0;function I0(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function L0(n,e){let t=new D0,i=(function(){let l={};return{get:function(c){if(l[c.id]!==void 0)return l[c.id];let h;switch(c.type){case"DirectionalLight":case"SpotLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new k};break;case"PointLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new k,shadowCameraNear:1,shadowCameraFar:1e3}}return l[c.id]=h,h}}})(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)r.probe.push(new E);let s=new E,a=new Ne,o=new Ne;return{setup:function(l,c){let h=0,u=0,d=0;for(let I=0;I<9;I++)r.probe[I].set(0,0,0);let p=0,m=0,x=0,f=0,y=0,v=0,g=0,w=0,b=0,_=0,M=0;l.sort(I0);let P=c===!0?Math.PI:1;for(let I=0,N=l.length;I<N;I++){let C=l[I],z=C.color,O=C.intensity,q=C.distance,le=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=z.r*O*P,u+=z.g*O*P,d+=z.b*O*P;else if(C.isLightProbe){for(let J=0;J<9;J++)r.probe[J].addScaledVector(C.sh.coefficients[J],O);M++}else if(C.isDirectionalLight){let J=t.get(C);if(J.color.copy(C.color).multiplyScalar(C.intensity*P),C.castShadow){let Z=C.shadow,$=i.get(C);$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,r.directionalShadow[p]=$,r.directionalShadowMap[p]=le,r.directionalShadowMatrix[p]=C.shadow.matrix,v++}r.directional[p]=J,p++}else if(C.isSpotLight){let J=t.get(C);J.position.setFromMatrixPosition(C.matrixWorld),J.color.copy(z).multiplyScalar(O*P),J.distance=q,J.coneCos=Math.cos(C.angle),J.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),J.decay=C.decay,r.spot[x]=J;let Z=C.shadow;if(C.map&&(r.spotLightMap[b]=C.map,b++,Z.updateMatrices(C),C.castShadow&&_++),r.spotLightMatrix[x]=Z.matrix,C.castShadow){let $=i.get(C);$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,r.spotShadow[x]=$,r.spotShadowMap[x]=le,w++}x++}else if(C.isRectAreaLight){let J=t.get(C);J.color.copy(z).multiplyScalar(O),J.halfWidth.set(.5*C.width,0,0),J.halfHeight.set(0,.5*C.height,0),r.rectArea[f]=J,f++}else if(C.isPointLight){let J=t.get(C);if(J.color.copy(C.color).multiplyScalar(C.intensity*P),J.distance=C.distance,J.decay=C.decay,C.castShadow){let Z=C.shadow,$=i.get(C);$.shadowBias=Z.bias,$.shadowNormalBias=Z.normalBias,$.shadowRadius=Z.radius,$.shadowMapSize=Z.mapSize,$.shadowCameraNear=Z.camera.near,$.shadowCameraFar=Z.camera.far,r.pointShadow[m]=$,r.pointShadowMap[m]=le,r.pointShadowMatrix[m]=C.shadow.matrix,g++}r.point[m]=J,m++}else if(C.isHemisphereLight){let J=t.get(C);J.skyColor.copy(C.color).multiplyScalar(O*P),J.groundColor.copy(C.groundColor).multiplyScalar(O*P),r.hemi[y]=J,y++}}f>0&&(e.isWebGL2?n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=de.LTC_FLOAT_1,r.rectAreaLTC2=de.LTC_FLOAT_2):(r.rectAreaLTC1=de.LTC_HALF_1,r.rectAreaLTC2=de.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=de.LTC_FLOAT_1,r.rectAreaLTC2=de.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=de.LTC_HALF_1,r.rectAreaLTC2=de.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=h,r.ambient[1]=u,r.ambient[2]=d;let R=r.hash;R.directionalLength===p&&R.pointLength===m&&R.spotLength===x&&R.rectAreaLength===f&&R.hemiLength===y&&R.numDirectionalShadows===v&&R.numPointShadows===g&&R.numSpotShadows===w&&R.numSpotMaps===b&&R.numLightProbes===M||(r.directional.length=p,r.spot.length=x,r.rectArea.length=f,r.point.length=m,r.hemi.length=y,r.directionalShadow.length=v,r.directionalShadowMap.length=v,r.pointShadow.length=g,r.pointShadowMap.length=g,r.spotShadow.length=w,r.spotShadowMap.length=w,r.directionalShadowMatrix.length=v,r.pointShadowMatrix.length=g,r.spotLightMatrix.length=w+b-_,r.spotLightMap.length=b,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=M,R.directionalLength=p,R.pointLength=m,R.spotLength=x,R.rectAreaLength=f,R.hemiLength=y,R.numDirectionalShadows=v,R.numPointShadows=g,R.numSpotShadows=w,R.numSpotMaps=b,R.numLightProbes=M,r.version=P0++)},setupView:function(l,c){let h=0,u=0,d=0,p=0,m=0,x=c.matrixWorldInverse;for(let f=0,y=l.length;f<y;f++){let v=l[f];if(v.isDirectionalLight){let g=r.directional[h];g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(x),h++}else if(v.isSpotLight){let g=r.spot[d];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(x),g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(x),d++}else if(v.isRectAreaLight){let g=r.rectArea[p];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(x),o.identity(),a.copy(v.matrixWorld),a.premultiply(x),o.extractRotation(a),g.halfWidth.set(.5*v.width,0,0),g.halfHeight.set(0,.5*v.height,0),g.halfWidth.applyMatrix4(o),g.halfHeight.applyMatrix4(o),p++}else if(v.isPointLight){let g=r.point[u];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(x),u++}else if(v.isHemisphereLight){let g=r.hemi[m];g.direction.setFromMatrixPosition(v.matrixWorld),g.direction.transformDirection(x),m++}}},state:r}}function Nu(n,e){let t=new L0(n,e),i=[],r=[];return{init:function(){i.length=0,r.length=0},state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:function(s){t.setup(i,s)},setupLightsView:function(s){t.setupView(i,s)},pushLight:function(s){i.push(s)},pushShadow:function(s){r.push(s)}}}function B0(n,e){let t=new WeakMap;return{get:function(i,r=0){let s=t.get(i),a;return s===void 0?(a=new Nu(n,e),t.set(i,[a])):r>=s.length?(a=new Nu(n,e),s.push(a)):a=s[r],a},dispose:function(){t=new WeakMap}}}var io=class extends wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},$l=class extends wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function U0(n,e,t){let i=new Kr,r=new k,s=new k,a=new et,o=new io({depthPacking:3201}),l=new $l,c={},h=t.maxTextureSize,u={[jn]:Tt,[Tt]:jn,2:2},d=new He({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new k},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let m=new tt;m.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Je(m,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ku;let y=this.type;function v(_,M){let P=e.update(x);d.defines.VSM_SAMPLES!==_.blurSamples&&(d.defines.VSM_SAMPLES=_.blurSamples,p.defines.VSM_SAMPLES=_.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),_.mapPass===null&&(_.mapPass=new Fe(r.x,r.y)),d.uniforms.shadow_pass.value=_.map.texture,d.uniforms.resolution.value=_.mapSize,d.uniforms.radius.value=_.radius,n.setRenderTarget(_.mapPass),n.clear(),n.renderBufferDirect(M,null,P,d,x,null),p.uniforms.shadow_pass.value=_.mapPass.texture,p.uniforms.resolution.value=_.mapSize,p.uniforms.radius.value=_.radius,n.setRenderTarget(_.map),n.clear(),n.renderBufferDirect(M,null,P,p,x,null)}function g(_,M,P,R){let I=null,N=P.isPointLight===!0?_.customDistanceMaterial:_.customDepthMaterial;if(N!==void 0)I=N;else if(I=P.isPointLight===!0?l:o,n.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){let C=I.uuid,z=M.uuid,O=c[C];O===void 0&&(O={},c[C]=O);let q=O[z];q===void 0&&(q=I.clone(),O[z]=q,M.addEventListener("dispose",b)),I=q}return I.visible=M.visible,I.wireframe=M.wireframe,I.side=R===li?M.shadowSide!==null?M.shadowSide:M.side:M.shadowSide!==null?M.shadowSide:u[M.side],I.alphaMap=M.alphaMap,I.alphaTest=M.alphaTest,I.map=M.map,I.clipShadows=M.clipShadows,I.clippingPlanes=M.clippingPlanes,I.clipIntersection=M.clipIntersection,I.displacementMap=M.displacementMap,I.displacementScale=M.displacementScale,I.displacementBias=M.displacementBias,I.wireframeLinewidth=M.wireframeLinewidth,I.linewidth=M.linewidth,P.isPointLight===!0&&I.isMeshDistanceMaterial===!0&&(n.properties.get(I).light=P),I}function w(_,M,P,R,I){if(_.visible===!1)return;if(_.layers.test(M.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&I===li)&&(!_.frustumCulled||i.intersectsObject(_))){_.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,_.matrixWorld);let C=e.update(_),z=_.material;if(Array.isArray(z)){let O=C.groups;for(let q=0,le=O.length;q<le;q++){let J=O[q],Z=z[J.materialIndex];if(Z&&Z.visible){let $=g(_,Z,R,I);_.onBeforeShadow(n,_,M,P,C,$,J),n.renderBufferDirect(P,null,C,$,_,J),_.onAfterShadow(n,_,M,P,C,$,J)}}}else if(z.visible){let O=g(_,z,R,I);_.onBeforeShadow(n,_,M,P,C,O,null),n.renderBufferDirect(P,null,C,O,_,null),_.onAfterShadow(n,_,M,P,C,O,null)}}let N=_.children;for(let C=0,z=N.length;C<z;C++)w(N[C],M,P,R,I)}function b(_){_.target.removeEventListener("dispose",b);for(let M in c){let P=c[M],R=_.target.uuid;R in P&&(P[R].dispose(),delete P[R])}}this.render=function(_,M,P){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||_.length===0)return;let R=n.getRenderTarget(),I=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),C=n.state;C.setBlending(0),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);let z=y!==li&&this.type===li,O=y===li&&this.type!==li;for(let q=0,le=_.length;q<le;q++){let J=_[q],Z=J.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;r.copy(Z.mapSize);let $=Z.getFrameExtents();if(r.multiply($),s.copy(Z.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/$.x),r.x=s.x*$.x,Z.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/$.y),r.y=s.y*$.y,Z.mapSize.y=s.y)),Z.map===null||z===!0||O===!0){let V=this.type!==li?{minFilter:wt,magFilter:wt}:{};Z.map!==null&&Z.map.dispose(),Z.map=new Fe(r.x,r.y,V),Z.map.texture.name=J.name+".shadowMap",Z.camera.updateProjectionMatrix()}n.setRenderTarget(Z.map),n.clear();let U=Z.getViewportCount();for(let V=0;V<U;V++){let te=Z.getViewport(V);a.set(s.x*te.x,s.y*te.y,s.x*te.z,s.y*te.w),C.viewport(a),Z.updateMatrices(J,V),i=Z.getFrustum(),w(M,P,Z.camera,J,this.type)}Z.isPointLightShadow!==!0&&this.type===li&&v(Z,P),Z.needsUpdate=!1}y=this.type,f.needsUpdate=!1,n.setRenderTarget(R,I,N)}}function N0(n,e,t){let i=t.isWebGL2,r=new function(){let T=!1,ae=new et,Y=null,j=new et(0,0,0,0);return{setMask:function(oe){Y===oe||T||(n.colorMask(oe,oe,oe,oe),Y=oe)},setLocked:function(oe){T=oe},setClear:function(oe,pe,fe,xe,Re){Re===!0&&(oe*=xe,pe*=xe,fe*=xe),ae.set(oe,pe,fe,xe),j.equals(ae)===!1&&(n.clearColor(oe,pe,fe,xe),j.copy(ae))},reset:function(){T=!1,Y=null,j.set(-1,0,0,0)}}},s=new function(){let T=!1,ae=null,Y=null,j=null;return{setTest:function(oe){oe?ee(n.DEPTH_TEST):L(n.DEPTH_TEST)},setMask:function(oe){ae===oe||T||(n.depthMask(oe),ae=oe)},setFunc:function(oe){if(Y!==oe){switch(oe){case 0:n.depthFunc(n.NEVER);break;case 1:n.depthFunc(n.ALWAYS);break;case 2:n.depthFunc(n.LESS);break;case 3:default:n.depthFunc(n.LEQUAL);break;case 4:n.depthFunc(n.EQUAL);break;case 5:n.depthFunc(n.GEQUAL);break;case 6:n.depthFunc(n.GREATER);break;case 7:n.depthFunc(n.NOTEQUAL)}Y=oe}},setLocked:function(oe){T=oe},setClear:function(oe){j!==oe&&(n.clearDepth(oe),j=oe)},reset:function(){T=!1,ae=null,Y=null,j=null}}},a=new function(){let T=!1,ae=null,Y=null,j=null,oe=null,pe=null,fe=null,xe=null,Re=null;return{setTest:function(ve){T||(ve?ee(n.STENCIL_TEST):L(n.STENCIL_TEST))},setMask:function(ve){ae===ve||T||(n.stencilMask(ve),ae=ve)},setFunc:function(ve,ye,Ue){Y===ve&&j===ye&&oe===Ue||(n.stencilFunc(ve,ye,Ue),Y=ve,j=ye,oe=Ue)},setOp:function(ve,ye,Ue){pe===ve&&fe===ye&&xe===Ue||(n.stencilOp(ve,ye,Ue),pe=ve,fe=ye,xe=Ue)},setLocked:function(ve){T=ve},setClear:function(ve){Re!==ve&&(n.clearStencil(ve),Re=ve)},reset:function(){T=!1,ae=null,Y=null,j=null,oe=null,pe=null,fe=null,xe=null,Re=null}}},o=new WeakMap,l=new WeakMap,c={},h={},u=new WeakMap,d=[],p=null,m=!1,x=null,f=null,y=null,v=null,g=null,w=null,b=null,_=new he(0,0,0),M=0,P=!1,R=null,I=null,N=null,C=null,z=null,O=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,le=0,J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(J)[1]),q=le>=1):J.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),q=le>=2);let Z=null,$={},U=n.getParameter(n.SCISSOR_BOX),V=n.getParameter(n.VIEWPORT),te=new et().fromArray(U),A=new et().fromArray(V);function S(T,ae,Y,j){let oe=new Uint8Array(4),pe=n.createTexture();n.bindTexture(T,pe),n.texParameteri(T,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(T,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let fe=0;fe<Y;fe++)!i||T!==n.TEXTURE_3D&&T!==n.TEXTURE_2D_ARRAY?n.texImage2D(ae+fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage3D(ae,0,n.RGBA,1,1,j,0,n.RGBA,n.UNSIGNED_BYTE,oe);return pe}let G={};function ee(T){c[T]!==!0&&(n.enable(T),c[T]=!0)}function L(T){c[T]!==!1&&(n.disable(T),c[T]=!1)}G[n.TEXTURE_2D]=S(n.TEXTURE_2D,n.TEXTURE_2D,1),G[n.TEXTURE_CUBE_MAP]=S(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(G[n.TEXTURE_2D_ARRAY]=S(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),G[n.TEXTURE_3D]=S(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),ee(n.DEPTH_TEST),s.setFunc(3),W(!1),re(1),ee(n.CULL_FACE),H(0);let Q={[qi]:n.FUNC_ADD,101:n.FUNC_SUBTRACT,102:n.FUNC_REVERSE_SUBTRACT};if(i)Q[103]=n.MIN,Q[104]=n.MAX;else{let T=e.get("EXT_blend_minmax");T!==null&&(Q[103]=T.MIN_EXT,Q[104]=T.MAX_EXT)}let F={200:n.ZERO,201:n.ONE,202:n.SRC_COLOR,[Ul]:n.SRC_ALPHA,210:n.SRC_ALPHA_SATURATE,208:n.DST_COLOR,206:n.DST_ALPHA,203:n.ONE_MINUS_SRC_COLOR,[Nl]:n.ONE_MINUS_SRC_ALPHA,209:n.ONE_MINUS_DST_COLOR,207:n.ONE_MINUS_DST_ALPHA,211:n.CONSTANT_COLOR,212:n.ONE_MINUS_CONSTANT_COLOR,213:n.CONSTANT_ALPHA,214:n.ONE_MINUS_CONSTANT_ALPHA};function H(T,ae,Y,j,oe,pe,fe,xe,Re,ve){if(T!==0){if(m===!1&&(ee(n.BLEND),m=!0),T===5)oe=oe||ae,pe=pe||Y,fe=fe||j,ae===f&&oe===g||(n.blendEquationSeparate(Q[ae],Q[oe]),f=ae,g=oe),Y===y&&j===v&&pe===w&&fe===b||(n.blendFuncSeparate(F[Y],F[j],F[pe],F[fe]),y=Y,v=j,w=pe,b=fe),xe.equals(_)!==!1&&Re===M||(n.blendColor(xe.r,xe.g,xe.b,Re),_.copy(xe),M=Re),x=T,P=!1;else if(T!==x||ve!==P){if(f===qi&&g===qi||(n.blendEquation(n.FUNC_ADD),f=qi,g=qi),ve)switch(T){case 1:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFunc(n.ONE,n.ONE);break;case 3:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case 4:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",T)}else switch(T){case 1:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case 3:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case 4:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",T)}y=null,v=null,w=null,b=null,_.set(0,0,0),M=0,x=T,P=ve}}else m===!0&&(L(n.BLEND),m=!1)}function W(T){R!==T&&(T?n.frontFace(n.CW):n.frontFace(n.CCW),R=T)}function re(T){T!==0?(ee(n.CULL_FACE),T!==I&&(T===1?n.cullFace(n.BACK):T===2?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):L(n.CULL_FACE),I=T}function ne(T,ae,Y){T?(ee(n.POLYGON_OFFSET_FILL),C===ae&&z===Y||(n.polygonOffset(ae,Y),C=ae,z=Y)):L(n.POLYGON_OFFSET_FILL)}return{buffers:{color:r,depth:s,stencil:a},enable:ee,disable:L,bindFramebuffer:function(T,ae){return h[T]!==ae&&(n.bindFramebuffer(T,ae),h[T]=ae,i&&(T===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ae),T===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ae)),!0)},drawBuffers:function(T,ae){let Y=d,j=!1;if(T)if(Y=u.get(ae),Y===void 0&&(Y=[],u.set(ae,Y)),T.isWebGLMultipleRenderTargets){let oe=T.texture;if(Y.length!==oe.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,fe=oe.length;pe<fe;pe++)Y[pe]=n.COLOR_ATTACHMENT0+pe;Y.length=oe.length,j=!0}}else Y[0]!==n.COLOR_ATTACHMENT0&&(Y[0]=n.COLOR_ATTACHMENT0,j=!0);else Y[0]!==n.BACK&&(Y[0]=n.BACK,j=!0);j&&(t.isWebGL2?n.drawBuffers(Y):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Y))},useProgram:function(T){return p!==T&&(n.useProgram(T),p=T,!0)},setBlending:H,setMaterial:function(T,ae){T.side===2?L(n.CULL_FACE):ee(n.CULL_FACE);let Y=T.side===Tt;ae&&(Y=!Y),W(Y),T.blending===1&&T.transparent===!1?H(0):H(T.blending,T.blendEquation,T.blendSrc,T.blendDst,T.blendEquationAlpha,T.blendSrcAlpha,T.blendDstAlpha,T.blendColor,T.blendAlpha,T.premultipliedAlpha),s.setFunc(T.depthFunc),s.setTest(T.depthTest),s.setMask(T.depthWrite),r.setMask(T.colorWrite);let j=T.stencilWrite;a.setTest(j),j&&(a.setMask(T.stencilWriteMask),a.setFunc(T.stencilFunc,T.stencilRef,T.stencilFuncMask),a.setOp(T.stencilFail,T.stencilZFail,T.stencilZPass)),ne(T.polygonOffset,T.polygonOffsetFactor,T.polygonOffsetUnits),T.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):L(n.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:W,setCullFace:re,setLineWidth:function(T){T!==N&&(q&&n.lineWidth(T),N=T)},setPolygonOffset:ne,setScissorTest:function(T){T?ee(n.SCISSOR_TEST):L(n.SCISSOR_TEST)},activeTexture:function(T){T===void 0&&(T=n.TEXTURE0+O-1),Z!==T&&(n.activeTexture(T),Z=T)},bindTexture:function(T,ae,Y){Y===void 0&&(Y=Z===null?n.TEXTURE0+O-1:Z);let j=$[Y];j===void 0&&(j={type:void 0,texture:void 0},$[Y]=j),j.type===T&&j.texture===ae||(Z!==Y&&(n.activeTexture(Y),Z=Y),n.bindTexture(T,ae||G[T]),j.type=T,j.texture=ae)},unbindTexture:function(){let T=$[Z];T!==void 0&&T.type!==void 0&&(n.bindTexture(T.type,null),T.type=void 0,T.texture=void 0)},compressedTexImage2D:function(){try{n.compressedTexImage2D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexImage3D:function(){try{n.compressedTexImage3D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texImage2D:function(){try{n.texImage2D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texImage3D:function(){try{n.texImage3D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},updateUBOMapping:function(T,ae){let Y=l.get(ae);Y===void 0&&(Y=new WeakMap,l.set(ae,Y));let j=Y.get(T);j===void 0&&(j=n.getUniformBlockIndex(ae,T.name),Y.set(T,j))},uniformBlockBinding:function(T,ae){let Y=l.get(ae).get(T);o.get(ae)!==Y&&(n.uniformBlockBinding(ae,Y,T.__bindingPointIndex),o.set(ae,Y))},texStorage2D:function(){try{n.texStorage2D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texStorage3D:function(){try{n.texStorage3D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texSubImage2D:function(){try{n.texSubImage2D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texSubImage3D:function(){try{n.texSubImage3D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexSubImage2D:function(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexSubImage3D:function(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},scissor:function(T){te.equals(T)===!1&&(n.scissor(T.x,T.y,T.z,T.w),te.copy(T))},viewport:function(T){A.equals(T)===!1&&(n.viewport(T.x,T.y,T.z,T.w),A.copy(T))},reset:function(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},Z=null,$={},h={},u=new WeakMap,d=[],p=null,m=!1,x=null,f=null,y=null,v=null,g=null,w=null,b=null,_=new he(0,0,0),M=0,P=!1,R=null,I=null,N=null,C=null,z=null,te.set(0,0,n.canvas.width,n.canvas.height),A.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),a.reset()}}}function O0(n,e,t,i,r,s,a){let o=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,S){return p?new OffscreenCanvas(A,S):Ya("canvas")}function x(A,S,G,ee){let L=1;if((A.width>ee||A.height>ee)&&(L=ee/Math.max(A.width,A.height)),L<1||S===!0){if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){let Q=S?Xa:Math.floor,F=Q(L*A.width),H=Q(L*A.height);u===void 0&&(u=m(F,H));let W=G?m(F,H):u;return W.width=F,W.height=H,W.getContext("2d").drawImage(A,0,0,F,H),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+F+"x"+H+")."),W}return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A}return A}function f(A){return Vl(A.width)&&Vl(A.height)}function y(A,S){return A.generateMipmaps&&S&&A.minFilter!==wt&&A.minFilter!==Pt}function v(A){n.generateMipmap(A)}function g(A,S,G,ee,L=!1){if(o===!1)return S;if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Q=S;if(S===n.RED&&(G===n.FLOAT&&(Q=n.R32F),G===n.HALF_FLOAT&&(Q=n.R16F),G===n.UNSIGNED_BYTE&&(Q=n.R8)),S===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.R8UI),G===n.UNSIGNED_SHORT&&(Q=n.R16UI),G===n.UNSIGNED_INT&&(Q=n.R32UI),G===n.BYTE&&(Q=n.R8I),G===n.SHORT&&(Q=n.R16I),G===n.INT&&(Q=n.R32I)),S===n.RG&&(G===n.FLOAT&&(Q=n.RG32F),G===n.HALF_FLOAT&&(Q=n.RG16F),G===n.UNSIGNED_BYTE&&(Q=n.RG8)),S===n.RGBA){let F=L?Ga:dt.getTransfer(ee);G===n.FLOAT&&(Q=n.RGBA32F),G===n.HALF_FLOAT&&(Q=n.RGBA16F),G===n.UNSIGNED_BYTE&&(Q=F===gt?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return Q!==n.R16F&&Q!==n.R32F&&Q!==n.RG16F&&Q!==n.RG32F&&Q!==n.RGBA16F&&Q!==n.RGBA32F||e.get("EXT_color_buffer_float"),Q}function w(A,S,G){return y(A,G)===!0||A.isFramebufferTexture&&A.minFilter!==wt&&A.minFilter!==Pt?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function b(A){return A===wt||A===Ah||A===Jo?n.NEAREST:n.LINEAR}function _(A){let S=A.target;S.removeEventListener("dispose",_),(function(G){let ee=i.get(G);if(ee.__webglInit===void 0)return;let L=G.source,Q=d.get(L);if(Q){let F=Q[ee.__cacheKey];F.usedTimes--,F.usedTimes===0&&P(G),Object.keys(Q).length===0&&d.delete(L)}i.remove(G)})(S),S.isVideoTexture&&h.delete(S)}function M(A){let S=A.target;S.removeEventListener("dispose",M),(function(G){let ee=G.texture,L=i.get(G),Q=i.get(ee);if(Q.__webglTexture!==void 0&&(n.deleteTexture(Q.__webglTexture),a.memory.textures--),G.depthTexture&&G.depthTexture.dispose(),G.isWebGLCubeRenderTarget)for(let F=0;F<6;F++){if(Array.isArray(L.__webglFramebuffer[F]))for(let H=0;H<L.__webglFramebuffer[F].length;H++)n.deleteFramebuffer(L.__webglFramebuffer[F][H]);else n.deleteFramebuffer(L.__webglFramebuffer[F]);L.__webglDepthbuffer&&n.deleteRenderbuffer(L.__webglDepthbuffer[F])}else{if(Array.isArray(L.__webglFramebuffer))for(let F=0;F<L.__webglFramebuffer.length;F++)n.deleteFramebuffer(L.__webglFramebuffer[F]);else n.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&n.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&n.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let F=0;F<L.__webglColorRenderbuffer.length;F++)L.__webglColorRenderbuffer[F]&&n.deleteRenderbuffer(L.__webglColorRenderbuffer[F]);L.__webglDepthRenderbuffer&&n.deleteRenderbuffer(L.__webglDepthRenderbuffer)}if(G.isWebGLMultipleRenderTargets)for(let F=0,H=ee.length;F<H;F++){let W=i.get(ee[F]);W.__webglTexture&&(n.deleteTexture(W.__webglTexture),a.memory.textures--),i.remove(ee[F])}i.remove(ee),i.remove(G)})(S)}function P(A){let S=i.get(A);n.deleteTexture(S.__webglTexture);let G=A.source;delete d.get(G)[S.__cacheKey],a.memory.textures--}let R=0;function I(A,S){let G=i.get(A);if(A.isVideoTexture&&(function(ee){let L=a.render.frame;h.get(ee)!==L&&(h.set(ee,L),ee.update())})(A),A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){let ee=A.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(ee.complete!==!1)return void le(G,A,S);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+S)}let N={[Zr]:n.REPEAT,[Vn]:n.CLAMP_TO_EDGE,[Hl]:n.MIRRORED_REPEAT},C={[wt]:n.NEAREST,[Ah]:n.NEAREST_MIPMAP_NEAREST,[Jo]:n.NEAREST_MIPMAP_LINEAR,[Pt]:n.LINEAR,[Zp]:n.LINEAR_MIPMAP_NEAREST,[Cs]:n.LINEAR_MIPMAP_LINEAR},z={512:n.NEVER,519:n.ALWAYS,513:n.LESS,515:n.LEQUAL,514:n.EQUAL,518:n.GEQUAL,516:n.GREATER,517:n.NOTEQUAL};function O(A,S,G){if(G?(n.texParameteri(A,n.TEXTURE_WRAP_S,N[S.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,N[S.wrapT]),A!==n.TEXTURE_3D&&A!==n.TEXTURE_2D_ARRAY||n.texParameteri(A,n.TEXTURE_WRAP_R,N[S.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,C[S.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,C[S.minFilter])):(n.texParameteri(A,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(A,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),A!==n.TEXTURE_3D&&A!==n.TEXTURE_2D_ARRAY||n.texParameteri(A,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),S.wrapS===Vn&&S.wrapT===Vn||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(A,n.TEXTURE_MAG_FILTER,b(S.magFilter)),n.texParameteri(A,n.TEXTURE_MIN_FILTER,b(S.minFilter)),S.minFilter!==wt&&S.minFilter!==Pt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,z[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){let ee=e.get("EXT_texture_filter_anisotropic");if(S.magFilter===wt||S.minFilter!==Jo&&S.minFilter!==Cs||S.type===pn&&e.has("OES_texture_float_linear")===!1||o===!1&&S.type===tr&&e.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||i.get(S).__currentAnisotropy)&&(n.texParameterf(A,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy)}}function q(A,S){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",_));let ee=S.source,L=d.get(ee);L===void 0&&(L={},d.set(ee,L));let Q=(function(F){let H=[];return H.push(F.wrapS),H.push(F.wrapT),H.push(F.wrapR||0),H.push(F.magFilter),H.push(F.minFilter),H.push(F.anisotropy),H.push(F.internalFormat),H.push(F.format),H.push(F.type),H.push(F.generateMipmaps),H.push(F.premultiplyAlpha),H.push(F.flipY),H.push(F.unpackAlignment),H.push(F.colorSpace),H.join()})(S);if(Q!==A.__cacheKey){L[Q]===void 0&&(L[Q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,G=!0),L[Q].usedTimes++;let F=L[A.__cacheKey];F!==void 0&&(L[A.__cacheKey].usedTimes--,F.usedTimes===0&&P(S)),A.__cacheKey=Q,A.__webglTexture=L[Q].texture}return G}function le(A,S,G){let ee=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ee=n.TEXTURE_3D);let L=q(A,S),Q=S.source;t.bindTexture(ee,A.__webglTexture,n.TEXTURE0+G);let F=i.get(Q);if(Q.version!==F.__version||L===!0){t.activeTexture(n.TEXTURE0+G);let H=dt.getPrimaries(dt.workingColorSpace),W=S.colorSpace===dn?null:dt.getPrimaries(S.colorSpace),re=S.colorSpace===dn||H===W?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let ne=(function(ye){return!o&&(ye.wrapS!==Vn||ye.wrapT!==Vn||ye.minFilter!==wt&&ye.minFilter!==Pt)})(S)&&f(S.image)===!1,T=x(S.image,ne,!1,r.maxTextureSize);T=te(S,T);let ae=f(T)||o,Y=s.convert(S.format,S.colorSpace),j,oe=s.convert(S.type),pe=g(S.internalFormat,Y,oe,S.colorSpace,S.isVideoTexture);O(ee,S,ae);let fe=S.mipmaps,xe=o&&S.isVideoTexture!==!0&&pe!==ad,Re=F.__version===void 0||L===!0,ve=w(S,T,ae);if(S.isDepthTexture)pe=n.DEPTH_COMPONENT,o?pe=S.type===pn?n.DEPTH_COMPONENT32F:S.type===Xn?n.DEPTH_COMPONENT24:S.type===ci?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT16:S.type===pn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===$i&&pe===n.DEPTH_COMPONENT&&S.type!==Lc&&S.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=Xn,oe=s.convert(S.type)),S.format===_i&&pe===n.DEPTH_COMPONENT&&(pe=n.DEPTH_STENCIL,S.type!==ci&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=ci,oe=s.convert(S.type))),Re&&(xe?t.texStorage2D(n.TEXTURE_2D,1,pe,T.width,T.height):t.texImage2D(n.TEXTURE_2D,0,pe,T.width,T.height,0,Y,oe,null));else if(S.isDataTexture)if(fe.length>0&&ae){xe&&Re&&t.texStorage2D(n.TEXTURE_2D,ve,pe,fe[0].width,fe[0].height);for(let ye=0,Ue=fe.length;ye<Ue;ye++)j=fe[ye],xe?t.texSubImage2D(n.TEXTURE_2D,ye,0,0,j.width,j.height,Y,oe,j.data):t.texImage2D(n.TEXTURE_2D,ye,pe,j.width,j.height,0,Y,oe,j.data);S.generateMipmaps=!1}else xe?(Re&&t.texStorage2D(n.TEXTURE_2D,ve,pe,T.width,T.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,Y,oe,T.data)):t.texImage2D(n.TEXTURE_2D,0,pe,T.width,T.height,0,Y,oe,T.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){xe&&Re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,pe,fe[0].width,fe[0].height,T.depth);for(let ye=0,Ue=fe.length;ye<Ue;ye++)j=fe[ye],S.format!==un?Y!==null?xe?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ye,0,0,0,j.width,j.height,T.depth,Y,j.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ye,pe,j.width,j.height,T.depth,0,j.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):xe?t.texSubImage3D(n.TEXTURE_2D_ARRAY,ye,0,0,0,j.width,j.height,T.depth,Y,oe,j.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ye,pe,j.width,j.height,T.depth,0,Y,oe,j.data)}else{xe&&Re&&t.texStorage2D(n.TEXTURE_2D,ve,pe,fe[0].width,fe[0].height);for(let ye=0,Ue=fe.length;ye<Ue;ye++)j=fe[ye],S.format!==un?Y!==null?xe?t.compressedTexSubImage2D(n.TEXTURE_2D,ye,0,0,j.width,j.height,Y,j.data):t.compressedTexImage2D(n.TEXTURE_2D,ye,pe,j.width,j.height,0,j.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):xe?t.texSubImage2D(n.TEXTURE_2D,ye,0,0,j.width,j.height,Y,oe,j.data):t.texImage2D(n.TEXTURE_2D,ye,pe,j.width,j.height,0,Y,oe,j.data)}else if(S.isDataArrayTexture)xe?(Re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,pe,T.width,T.height,T.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,T.width,T.height,T.depth,Y,oe,T.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,pe,T.width,T.height,T.depth,0,Y,oe,T.data);else if(S.isData3DTexture)xe?(Re&&t.texStorage3D(n.TEXTURE_3D,ve,pe,T.width,T.height,T.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,T.width,T.height,T.depth,Y,oe,T.data)):t.texImage3D(n.TEXTURE_3D,0,pe,T.width,T.height,T.depth,0,Y,oe,T.data);else if(S.isFramebufferTexture){if(Re)if(xe)t.texStorage2D(n.TEXTURE_2D,ve,pe,T.width,T.height);else{let ye=T.width,Ue=T.height;for(let Rt=0;Rt<ve;Rt++)t.texImage2D(n.TEXTURE_2D,Rt,pe,ye,Ue,0,Y,oe,null),ye>>=1,Ue>>=1}}else if(fe.length>0&&ae){xe&&Re&&t.texStorage2D(n.TEXTURE_2D,ve,pe,fe[0].width,fe[0].height);for(let ye=0,Ue=fe.length;ye<Ue;ye++)j=fe[ye],xe?t.texSubImage2D(n.TEXTURE_2D,ye,0,0,Y,oe,j):t.texImage2D(n.TEXTURE_2D,ye,pe,Y,oe,j);S.generateMipmaps=!1}else xe?(Re&&t.texStorage2D(n.TEXTURE_2D,ve,pe,T.width,T.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,Y,oe,T)):t.texImage2D(n.TEXTURE_2D,0,pe,Y,oe,T);y(S,ae)&&v(ee),F.__version=Q.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function J(A,S,G,ee,L,Q){let F=s.convert(G.format,G.colorSpace),H=s.convert(G.type),W=g(G.internalFormat,F,H,G.colorSpace);if(!i.get(S).__hasExternalTextures){let re=Math.max(1,S.width>>Q),ne=Math.max(1,S.height>>Q);L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?t.texImage3D(L,Q,W,re,ne,S.depth,0,F,H,null):t.texImage2D(L,Q,W,re,ne,0,F,H,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),V(S)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,L,i.get(G).__webglTexture,0,U(S)):(L===n.TEXTURE_2D||L>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&L<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,L,i.get(G).__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Z(A,S,G){if(n.bindRenderbuffer(n.RENDERBUFFER,A),S.depthBuffer&&!S.stencilBuffer){let ee=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(G||V(S)){let L=S.depthTexture;L&&L.isDepthTexture&&(L.type===pn?ee=n.DEPTH_COMPONENT32F:L.type===Xn&&(ee=n.DEPTH_COMPONENT24));let Q=U(S);V(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Q,ee,S.width,S.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,ee,S.width,S.height)}else n.renderbufferStorage(n.RENDERBUFFER,ee,S.width,S.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,A)}else if(S.depthBuffer&&S.stencilBuffer){let ee=U(S);G&&V(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ee,n.DEPTH24_STENCIL8,S.width,S.height):V(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ee,n.DEPTH24_STENCIL8,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,A)}else{let ee=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let L=0;L<ee.length;L++){let Q=ee[L],F=s.convert(Q.format,Q.colorSpace),H=s.convert(Q.type),W=g(Q.internalFormat,F,H,Q.colorSpace),re=U(S);G&&V(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,re,W,S.width,S.height):V(S)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re,W,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,W,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function $(A){let S=i.get(A),G=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");(function(ee,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,ee),!L.depthTexture||!L.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");i.get(L.depthTexture).__webglTexture&&L.depthTexture.image.width===L.width&&L.depthTexture.image.height===L.height||(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),I(L.depthTexture,0);let Q=i.get(L.depthTexture).__webglTexture,F=U(L);if(L.depthTexture.format===$i)V(L)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,F):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else{if(L.depthTexture.format!==_i)throw new Error("Unknown depthTexture format");V(L)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,F):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0)}})(S.__webglFramebuffer,A)}else if(G){S.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[ee]),S.__webglDepthbuffer[ee]=n.createRenderbuffer(),Z(S.__webglDepthbuffer[ee],A,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=n.createRenderbuffer(),Z(S.__webglDepthbuffer,A,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function U(A){return Math.min(r.maxSamples,A.samples)}function V(A){let S=i.get(A);return o&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function te(A,S){let G=A.colorSpace,ee=A.format,L=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Gl||G!==fn&&G!==dn&&(dt.getTransfer(G)===gt?o===!1?e.has("EXT_sRGB")===!0&&ee===un?(A.format=Gl,A.minFilter=Pt,A.generateMipmaps=!1):S=ja.sRGBToLinear(S):ee===un&&L===ot||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}this.allocateTextureUnit=function(){let A=R;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),R+=1,A},this.resetTextureUnits=function(){R=0},this.setTexture2D=I,this.setTexture2DArray=function(A,S){let G=i.get(A);A.version>0&&G.__version!==A.version?le(G,A,S):t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+S)},this.setTexture3D=function(A,S){let G=i.get(A);A.version>0&&G.__version!==A.version?le(G,A,S):t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+S)},this.setTextureCube=function(A,S){let G=i.get(A);A.version>0&&G.__version!==A.version?(function(ee,L,Q){if(L.image.length!==6)return;let F=q(ee,L),H=L.source;t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture,n.TEXTURE0+Q);let W=i.get(H);if(H.version!==W.__version||F===!0){t.activeTexture(n.TEXTURE0+Q);let re=dt.getPrimaries(dt.workingColorSpace),ne=L.colorSpace===dn?null:dt.getPrimaries(L.colorSpace),T=L.colorSpace===dn||re===ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,L.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,L.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,T);let ae=L.isCompressedTexture||L.image[0].isCompressedTexture,Y=L.image[0]&&L.image[0].isDataTexture,j=[];for(let Se=0;Se<6;Se++)j[Se]=ae||Y?Y?L.image[Se].image:L.image[Se]:x(L.image[Se],!1,!0,r.maxCubemapSize),j[Se]=te(L,j[Se]);let oe=j[0],pe=f(oe)||o,fe=s.convert(L.format,L.colorSpace),xe=s.convert(L.type),Re=g(L.internalFormat,fe,xe,L.colorSpace),ve=o&&L.isVideoTexture!==!0,ye=W.__version===void 0||F===!0,Ue,Rt=w(L,oe,pe);if(O(n.TEXTURE_CUBE_MAP,L,pe),ae){ve&&ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Rt,Re,oe.width,oe.height);for(let Se=0;Se<6;Se++){Ue=j[Se].mipmaps;for(let Ye=0;Ye<Ue.length;Ye++){let Ge=Ue[Ye];L.format!==un?fe!==null?ve?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye,0,0,Ge.width,Ge.height,fe,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye,Re,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ve?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye,0,0,Ge.width,Ge.height,fe,xe,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye,Re,Ge.width,Ge.height,0,fe,xe,Ge.data)}}}else{Ue=L.mipmaps,ve&&ye&&(Ue.length>0&&Rt++,t.texStorage2D(n.TEXTURE_CUBE_MAP,Rt,Re,j[0].width,j[0].height));for(let Se=0;Se<6;Se++)if(Y){ve?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,j[Se].width,j[Se].height,fe,xe,j[Se].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,Re,j[Se].width,j[Se].height,0,fe,xe,j[Se].data);for(let Ye=0;Ye<Ue.length;Ye++){let Ge=Ue[Ye].image[Se].image;ve?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye+1,0,0,Ge.width,Ge.height,fe,xe,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye+1,Re,Ge.width,Ge.height,0,fe,xe,Ge.data)}}else{ve?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,fe,xe,j[Se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,Re,fe,xe,j[Se]);for(let Ye=0;Ye<Ue.length;Ye++){let Ge=Ue[Ye];ve?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye+1,0,0,fe,xe,Ge.image[Se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Se,Ye+1,Re,fe,xe,Ge.image[Se])}}}y(L,pe)&&v(n.TEXTURE_CUBE_MAP),W.__version=H.version,L.onUpdate&&L.onUpdate(L)}ee.__version=L.version})(G,A,S):t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+S)},this.rebindTextures=function(A,S,G){let ee=i.get(A);S!==void 0&&J(ee.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&$(A)},this.setupRenderTarget=function(A){let S=A.texture,G=i.get(A),ee=i.get(S);A.addEventListener("dispose",M),A.isWebGLMultipleRenderTargets!==!0&&(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=S.version,a.memory.textures++);let L=A.isWebGLCubeRenderTarget===!0,Q=A.isWebGLMultipleRenderTargets===!0,F=f(A)||o;if(L){G.__webglFramebuffer=[];for(let H=0;H<6;H++)if(o&&S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[H]=[];for(let W=0;W<S.mipmaps.length;W++)G.__webglFramebuffer[H][W]=n.createFramebuffer()}else G.__webglFramebuffer[H]=n.createFramebuffer()}else{if(o&&S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let H=0;H<S.mipmaps.length;H++)G.__webglFramebuffer[H]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(Q)if(r.drawBuffers){let H=A.texture;for(let W=0,re=H.length;W<re;W++){let ne=i.get(H[W]);ne.__webglTexture===void 0&&(ne.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&A.samples>0&&V(A)===!1){let H=Q?S:[S];G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let W=0;W<H.length;W++){let re=H[W];G.__webglColorRenderbuffer[W]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[W]);let ne=s.convert(re.format,re.colorSpace),T=s.convert(re.type),ae=g(re.internalFormat,ne,T,re.colorSpace,A.isXRRenderTarget===!0),Y=U(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Y,ae,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+W,n.RENDERBUFFER,G.__webglColorRenderbuffer[W])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),Z(G.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(L){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),O(n.TEXTURE_CUBE_MAP,S,F);for(let H=0;H<6;H++)if(o&&S.mipmaps&&S.mipmaps.length>0)for(let W=0;W<S.mipmaps.length;W++)J(G.__webglFramebuffer[H][W],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+H,W);else J(G.__webglFramebuffer[H],A,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+H,0);y(S,F)&&v(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Q){let H=A.texture;for(let W=0,re=H.length;W<re;W++){let ne=H[W],T=i.get(ne);t.bindTexture(n.TEXTURE_2D,T.__webglTexture),O(n.TEXTURE_2D,ne,F),J(G.__webglFramebuffer,A,ne,n.COLOR_ATTACHMENT0+W,n.TEXTURE_2D,0),y(ne,F)&&v(n.TEXTURE_2D)}t.unbindTexture()}else{let H=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(o?H=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(H,ee.__webglTexture),O(H,S,F),o&&S.mipmaps&&S.mipmaps.length>0)for(let W=0;W<S.mipmaps.length;W++)J(G.__webglFramebuffer[W],A,S,n.COLOR_ATTACHMENT0,H,W);else J(G.__webglFramebuffer,A,S,n.COLOR_ATTACHMENT0,H,0);y(S,F)&&v(H),t.unbindTexture()}A.depthBuffer&&$(A)},this.updateRenderTargetMipmap=function(A){let S=f(A)||o,G=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let ee=0,L=G.length;ee<L;ee++){let Q=G[ee];if(y(Q,S)){let F=A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,H=i.get(Q).__webglTexture;t.bindTexture(F,H),v(F),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(A){if(o&&A.samples>0&&V(A)===!1){let S=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],G=A.width,ee=A.height,L=n.COLOR_BUFFER_BIT,Q=[],F=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=i.get(A),W=A.isWebGLMultipleRenderTargets===!0;if(W)for(let re=0;re<S.length;re++)t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,H.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,H.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,H.__webglFramebuffer);for(let re=0;re<S.length;re++){Q.push(n.COLOR_ATTACHMENT0+re),A.depthBuffer&&Q.push(F);let ne=H.__ignoreDepthValues!==void 0&&H.__ignoreDepthValues;if(ne===!1&&(A.depthBuffer&&(L|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&(L|=n.STENCIL_BUFFER_BIT)),W&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,H.__webglColorRenderbuffer[re]),ne===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[F]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[F])),W){let T=i.get(S[re]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,T,0)}n.blitFramebuffer(0,0,G,ee,0,0,G,ee,L,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),W)for(let re=0;re<S.length;re++){t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,H.__webglColorRenderbuffer[re]);let ne=i.get(S[re]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,H.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,H.__webglMultisampledFramebuffer)}},this.setupDepthRenderbuffer=$,this.setupFrameBufferTexture=J,this.useMultisampledRTT=V}function F0(n,e,t){let i=t.isWebGL2;return{convert:function(r,s=""){let a,o=dt.getTransfer(s);if(r===ot)return n.UNSIGNED_BYTE;if(r===td)return n.UNSIGNED_SHORT_4_4_4_4;if(r===nd)return n.UNSIGNED_SHORT_5_5_5_1;if(r===1010)return n.BYTE;if(r===1011)return n.SHORT;if(r===Lc)return n.UNSIGNED_SHORT;if(r===ed)return n.INT;if(r===Xn)return n.UNSIGNED_INT;if(r===pn)return n.FLOAT;if(r===tr)return i?n.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===1021)return n.ALPHA;if(r===un)return n.RGBA;if(r===1024)return n.LUMINANCE;if(r===1025)return n.LUMINANCE_ALPHA;if(r===$i)return n.DEPTH_COMPONENT;if(r===_i)return n.DEPTH_STENCIL;if(r===Gl)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===1028)return n.RED;if(r===id)return n.RED_INTEGER;if(r===1030)return n.RG;if(r===rd)return n.RG_INTEGER;if(r===sd)return n.RGBA_INTEGER;if(r===$o||r===el||r===tl||r===nl)if(o===gt){if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a===null)return null;if(r===$o)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===el)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===tl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===nl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(a=e.get("WEBGL_compressed_texture_s3tc"),a===null)return null;if(r===$o)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===el)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===tl)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===nl)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(r===Sh||r===_h||r===Th||r===bh){if(a=e.get("WEBGL_compressed_texture_pvrtc"),a===null)return null;if(r===Sh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===_h)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Th)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===bh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(r===ad)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ch||r===Rh){if(a=e.get("WEBGL_compressed_texture_etc"),a===null)return null;if(r===Ch)return o===gt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Rh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}if(r===Dh||r===Ph||r===Ih||r===Lh||r===Bh||r===Uh||r===Nh||r===Oh||r===Fh||r===Hh||r===zh||r===Gh||r===kh||r===Vh){if(a=e.get("WEBGL_compressed_texture_astc"),a===null)return null;if(r===Dh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ph)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ih)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Lh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Bh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Uh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Nh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Oh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Fh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Hh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===zh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Gh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===kh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Vh)return o===gt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}if(r===il||r===Wh||r===Xh){if(a=e.get("EXT_texture_compression_bptc"),a===null)return null;if(r===il)return o===gt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Wh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Xh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(r===36283||r===Yh||r===jh||r===Zh){if(a=e.get("EXT_texture_compression_rgtc"),a===null)return null;if(r===il)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Yh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===jh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Zh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return r===ci?i?n.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}}}var ec=class extends At{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ce=class extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},H0={type:"move"},Ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let f=t.getJointPose(x,i),y=this._getHandJoint(c,x);f!==null&&(y.matrix.fromArray(f.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=f.radius),y.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&d>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(H0)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Ce;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},tc=class extends $t{constructor(e,t){super();let i=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,m=null,x=t.getContextAttributes(),f=null,y=null,v=[],g=[],w=new k,b=null,_=new At;_.layers.enable(1),_.viewport=new et;let M=new At;M.layers.enable(2),M.viewport=new et;let P=[_,M],R=new ec;R.layers.enable(1),R.layers.enable(2);let I=null,N=null;function C(U){let V=g.indexOf(U.inputSource);if(V===-1)return;let te=v[V];te!==void 0&&(te.update(U.inputSource,U.frame,c||a),te.dispatchEvent({type:U.type,data:U.inputSource}))}function z(){r.removeEventListener("select",C),r.removeEventListener("selectstart",C),r.removeEventListener("selectend",C),r.removeEventListener("squeeze",C),r.removeEventListener("squeezestart",C),r.removeEventListener("squeezeend",C),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",O);for(let U=0;U<v.length;U++){let V=g[U];V!==null&&(g[U]=null,v[U].disconnect(V))}I=null,N=null,e.setRenderTarget(f),p=null,d=null,u=null,r=null,y=null,$.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}function O(U){for(let V=0;V<U.removed.length;V++){let te=U.removed[V],A=g.indexOf(te);A>=0&&(g[A]=null,v[A].disconnect(te))}for(let V=0;V<U.added.length;V++){let te=U.added[V],A=g.indexOf(te);if(A===-1){for(let G=0;G<v.length;G++){if(G>=g.length){g.push(te),A=G;break}if(g[G]===null){g[G]=te,A=G;break}}if(A===-1)break}let S=v[A];S&&S.connect(te)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let V=v[U];return V===void 0&&(V=new Ss,v[U]=V),V.getTargetRaySpace()},this.getControllerGrip=function(U){let V=v[U];return V===void 0&&(V=new Ss,v[U]=V),V.getGripSpace()},this.getHand=function(U){let V=v[U];return V===void 0&&(V=new Ss,v[U]=V),V.getHandSpace()},this.setFramebufferScaleFactor=function(U){s=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(U){if(r=U,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",C),r.addEventListener("selectstart",C),r.addEventListener("selectend",C),r.addEventListener("squeeze",C),r.addEventListener("squeezestart",C),r.addEventListener("squeezeend",C),r.addEventListener("end",z),r.addEventListener("inputsourceschange",O),x.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(w),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let V={antialias:r.renderState.layers!==void 0||x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,V),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Fe(p.framebufferWidth,p.framebufferHeight,{format:un,type:ot,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let V=null,te=null,A=null;x.depth&&(A=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,V=x.stencil?_i:$i,te=x.stencil?ci:Xn);let S={colorFormat:t.RGBA8,depthFormat:A,scaleFactor:s};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(S),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Fe(d.textureWidth,d.textureHeight,{format:un,type:ot,depthTexture:new ir(d.textureWidth,d.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,V),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0}),e.properties.get(y).__ignoreDepthValues=d.ignoreDepthValues}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),$.setContext(r),$.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};let q=new E,le=new E;function J(U,V){V===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(V.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(r===null)return;R.near=M.near=_.near=U.near,R.far=M.far=_.far=U.far,I===R.near&&N===R.far||(r.updateRenderState({depthNear:R.near,depthFar:R.far}),I=R.near,N=R.far);let V=U.parent,te=R.cameras;J(R,V);for(let A=0;A<te.length;A++)J(te[A],V);te.length===2?(function(A,S,G){q.setFromMatrixPosition(S.matrixWorld),le.setFromMatrixPosition(G.matrixWorld);let ee=q.distanceTo(le),L=S.projectionMatrix.elements,Q=G.projectionMatrix.elements,F=L[14]/(L[10]-1),H=L[14]/(L[10]+1),W=(L[9]+1)/L[5],re=(L[9]-1)/L[5],ne=(L[8]-1)/L[0],T=(Q[8]+1)/Q[0],ae=F*ne,Y=F*T,j=ee/(-ne+T),oe=j*-ne;S.matrixWorld.decompose(A.position,A.quaternion,A.scale),A.translateX(oe),A.translateZ(j),A.matrixWorld.compose(A.position,A.quaternion,A.scale),A.matrixWorldInverse.copy(A.matrixWorld).invert();let pe=F+j,fe=H+j,xe=ae-oe,Re=Y+(ee-oe),ve=W*H/fe*pe,ye=re*H/fe*pe;A.projectionMatrix.makePerspective(xe,Re,ve,ye,pe,fe),A.projectionMatrixInverse.copy(A.projectionMatrix).invert()})(R,_,M):R.projectionMatrix.copy(_.projectionMatrix),(function(A,S,G){G===null?A.matrix.copy(S.matrixWorld):(A.matrix.copy(G.matrixWorld),A.matrix.invert(),A.matrix.multiply(S.matrixWorld)),A.matrix.decompose(A.position,A.quaternion,A.scale),A.updateMatrixWorld(!0),A.projectionMatrix.copy(S.projectionMatrix),A.projectionMatrixInverse.copy(S.projectionMatrixInverse),A.isPerspectiveCamera&&(A.fov=2*Rs*Math.atan(1/A.projectionMatrix.elements[5]),A.zoom=1)})(U,R,V)},this.getCamera=function(){return R},this.getFoveation=function(){if(d!==null||p!==null)return l},this.setFoveation=function(U){l=U,d!==null&&(d.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)};let Z=null,$=new ud;$.setAnimationLoop((function(U,V){if(h=V.getViewerPose(c||a),m=V,h!==null){let te=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let A=!1;te.length!==R.cameras.length&&(R.cameras.length=0,A=!0);for(let S=0;S<te.length;S++){let G=te[S],ee=null;if(p!==null)ee=p.getViewport(G);else{let Q=u.getViewSubImage(d,G);ee=Q.viewport,S===0&&(e.setRenderTargetTextures(y,Q.colorTexture,d.ignoreDepthValues?void 0:Q.depthStencilTexture),e.setRenderTarget(y))}let L=P[S];L===void 0&&(L=new At,L.layers.enable(S),L.viewport=new et,P[S]=L),L.matrix.fromArray(G.transform.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale),L.projectionMatrix.fromArray(G.projectionMatrix),L.projectionMatrixInverse.copy(L.projectionMatrix).invert(),L.viewport.set(ee.x,ee.y,ee.width,ee.height),S===0&&(R.matrix.copy(L.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),A===!0&&R.cameras.push(L)}}for(let te=0;te<v.length;te++){let A=g[te],S=v[te];A!==null&&S!==void 0&&S.update(A,V,c||a)}Z&&Z(U,V),V.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:V}),m=null})),this.setAnimationLoop=function(U){Z=U},this.dispose=function(){}}};function z0(n,e){function t(r,s){r.matrixAutoUpdate===!0&&r.updateMatrix(),s.value.copy(r.matrix)}function i(r,s){r.opacity.value=s.opacity,s.color&&r.diffuse.value.copy(s.color),s.emissive&&r.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(r.map.value=s.map,t(s.map,r.mapTransform)),s.alphaMap&&(r.alphaMap.value=s.alphaMap,t(s.alphaMap,r.alphaMapTransform)),s.bumpMap&&(r.bumpMap.value=s.bumpMap,t(s.bumpMap,r.bumpMapTransform),r.bumpScale.value=s.bumpScale,s.side===Tt&&(r.bumpScale.value*=-1)),s.normalMap&&(r.normalMap.value=s.normalMap,t(s.normalMap,r.normalMapTransform),r.normalScale.value.copy(s.normalScale),s.side===Tt&&r.normalScale.value.negate()),s.displacementMap&&(r.displacementMap.value=s.displacementMap,t(s.displacementMap,r.displacementMapTransform),r.displacementScale.value=s.displacementScale,r.displacementBias.value=s.displacementBias),s.emissiveMap&&(r.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,r.emissiveMapTransform)),s.specularMap&&(r.specularMap.value=s.specularMap,t(s.specularMap,r.specularMapTransform)),s.alphaTest>0&&(r.alphaTest.value=s.alphaTest);let a=e.get(s).envMap;if(a&&(r.envMap.value=a,r.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=s.reflectivity,r.ior.value=s.ior,r.refractionRatio.value=s.refractionRatio),s.lightMap){r.lightMap.value=s.lightMap;let o=n._useLegacyLights===!0?Math.PI:1;r.lightMapIntensity.value=s.lightMapIntensity*o,t(s.lightMap,r.lightMapTransform)}s.aoMap&&(r.aoMap.value=s.aoMap,r.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,r.aoMapTransform))}return{refreshFogUniforms:function(r,s){s.color.getRGB(r.fogColor.value,hd(n)),s.isFog?(r.fogNear.value=s.near,r.fogFar.value=s.far):s.isFogExp2&&(r.fogDensity.value=s.density)},refreshMaterialUniforms:function(r,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(r,s):s.isMeshToonMaterial?(i(r,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(r,s)):s.isMeshPhongMaterial?(i(r,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(r,s)):s.isMeshStandardMaterial?(i(r,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),e.get(h).envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(r,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Tt&&c.clearcoatNormalScale.value.negate())),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(r,s,l)):s.isMeshMatcapMaterial?(i(r,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(r,s)):s.isMeshDepthMaterial?i(r,s):s.isMeshDistanceMaterial?(i(r,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(r,s)):s.isMeshNormalMaterial?i(r,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(r,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(r,s)):s.isPointsMaterial?(function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s,a,o):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s):s.isShadowMaterial?(r.color.value.copy(s.color),r.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function G0(n,e,t,i){let r={},s={},a=[],o=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(u,d,p,m){let x=u.value,f=d+"_"+p;if(m[f]===void 0)return m[f]=typeof x=="number"||typeof x=="boolean"?x:x.clone(),!0;{let y=m[f];if(typeof x=="number"||typeof x=="boolean"){if(y!==x)return m[f]=x,!0}else if(y.equals(x)===!1)return y.copy(x),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=a.indexOf(d.__bindingPointIndex);a.splice(p,1),n.deleteBuffer(r[d.id]),delete r[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;i.uniformBlockBinding(u,p)},update:function(u,d){let p=r[u.id];p===void 0&&((function(f){let y=f.uniforms,v=0,g=16;for(let b=0,_=y.length;b<_;b++){let M=Array.isArray(y[b])?y[b]:[y[b]];for(let P=0,R=M.length;P<R;P++){let I=M[P],N=Array.isArray(I.value)?I.value:[I.value];for(let C=0,z=N.length;C<z;C++){let O=c(N[C]),q=v%g;q!==0&&g-q<O.boundary&&(v+=g-q),I.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=v,v+=O.storage}}}let w=v%g;w>0&&(v+=g-w),f.__size=v,f.__cache={}})(u),p=(function(f){let y=(function(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=y;let v=n.createBuffer(),g=f.__size,w=f.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,g,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v})(u),r[u.id]=p,u.addEventListener("dispose",h));let m=d.program;i.updateUBOMapping(u,m);let x=e.render.frame;s[u.id]!==x&&((function(f){let y=r[f.id],v=f.uniforms,g=f.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let w=0,b=v.length;w<b;w++){let _=Array.isArray(v[w])?v[w]:[v[w]];for(let M=0,P=_.length;M<P;M++){let R=_[M];if(l(R,w,M,g)===!0){let I=R.__offset,N=Array.isArray(R.value)?R.value:[R.value],C=0;for(let z=0;z<N.length;z++){let O=N[z],q=c(O);typeof O=="number"||typeof O=="boolean"?(R.__data[0]=O,n.bufferSubData(n.UNIFORM_BUFFER,I+C,R.__data)):O.isMatrix3?(R.__data[0]=O.elements[0],R.__data[1]=O.elements[1],R.__data[2]=O.elements[2],R.__data[3]=0,R.__data[4]=O.elements[3],R.__data[5]=O.elements[4],R.__data[6]=O.elements[5],R.__data[7]=0,R.__data[8]=O.elements[6],R.__data[9]=O.elements[7],R.__data[10]=O.elements[8],R.__data[11]=0):(O.toArray(R.__data,C),C+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)})(u),s[u.id]=x)},dispose:function(){for(let u in r)n.deleteBuffer(r[u]);a=[],r={},s={}}}}var Ps=class{constructor(e={}){let{canvas:t=Qp(),context:i=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e,d;this.isWebGLRenderer=!0,d=i!==null?i.getContextAttributes().alpha:a;let p=new Uint32Array(4),m=new Int32Array(4),x=null,f=null,y=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=Ai,this.toneMappingExposure=1;let g=this,w=!1,b=0,_=0,M=null,P=-1,R=null,I=new et,N=new et,C=null,z=new he(0),O=0,q=t.width,le=t.height,J=1,Z=null,$=null,U=new et(0,0,q,le),V=new et(0,0,q,le),te=!1,A=new Kr,S=!1,G=!1,ee=null,L=new Ne,Q=new k,F=new E,H={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function W(){return M===null?J:1}let re,ne,T,ae,Y,j,oe,pe,fe,xe,Re,ve,ye,Ue,Rt,Se,Ye,Ge,Hi,xn,B,ge,Le,Ke,X=i;function yn(D,K){for(let ie=0;ie<D.length;ie++){let ce=D[ie],se=t.getContext(ce,K);if(se!==null)return se}return null}try{let D={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r160"),t.addEventListener("webglcontextlost",ta,!1),t.addEventListener("webglcontextrestored",hs,!1),t.addEventListener("webglcontextcreationerror",An,!1),X===null){let K=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&K.shift(),X=yn(K,D),X===null)throw yn(K)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(D){throw console.error("THREE.WebGLRenderer: "+D.message),D}function Ft(){re=new wf(X),ne=new xf(X,re,e),re.init(ne),ge=new F0(X,re,ne),T=new N0(X,re,ne),ae=new _f(X),Y=new b0,j=new O0(X,re,T,Y,ne,ge,ae),oe=new Ef(g),pe=new Mf(g),fe=new ff(X,ne),Le=new gf(X,re,fe,ne),xe=new Af(X,fe,ae,Le),Re=new Rf(X,xe,fe,ae),Hi=new Cf(X,ne,j),Se=new yf(Y),ve=new T0(g,oe,pe,re,ne,Le,Se),ye=new z0(g,Y),Ue=new R0,Rt=new B0(re,ne),Ge=new mf(g,oe,pe,T,Re,d,l),Ye=new U0(g,Re,ne),Ke=new G0(X,ae,ne,T),xn=new vf(X,re,ae,ne),B=new Sf(X,re,ae,ne),ae.programs=ve.programs,g.capabilities=ne,g.extensions=re,g.properties=Y,g.renderLists=Ue,g.shadowMap=Ye,g.state=T,g.info=ae}Ft();let kt=new tc(g,X);function ta(D){D.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function hs(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let D=ae.autoReset,K=Ye.enabled,ie=Ye.autoUpdate,ce=Ye.needsUpdate,se=Ye.type;Ft(),ae.autoReset=D,Ye.enabled=K,Ye.autoUpdate=ie,Ye.needsUpdate=ce,Ye.type=se}function An(D){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function Sn(D){let K=D.target;K.removeEventListener("dispose",Sn),(function(ie){(function(ce){let se=Y.get(ce).programs;se!==void 0&&(se.forEach((function(me){ve.releaseProgram(me)})),ce.isShaderMaterial&&ve.releaseShaderCache(ce))})(ie),Y.remove(ie)})(K)}function Mr(D,K,ie){D.transparent===!0&&D.side===2&&D.forceSinglePass===!1?(D.side=Tt,D.needsUpdate=!0,ia(D,K,ie),D.side=jn,D.needsUpdate=!0,ia(D,K,ie),D.side=2):ia(D,K,ie)}this.xr=kt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let D=re.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){let D=re.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(D){D!==void 0&&(J=D,this.setSize(q,le,!1))},this.getSize=function(D){return D.set(q,le)},this.setSize=function(D,K,ie=!0){kt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(q=D,le=K,t.width=Math.floor(D*J),t.height=Math.floor(K*J),ie===!0&&(t.style.width=D+"px",t.style.height=K+"px"),this.setViewport(0,0,D,K))},this.getDrawingBufferSize=function(D){return D.set(q*J,le*J).floor()},this.setDrawingBufferSize=function(D,K,ie){q=D,le=K,J=ie,t.width=Math.floor(D*ie),t.height=Math.floor(K*ie),this.setViewport(0,0,D,K)},this.getCurrentViewport=function(D){return D.copy(I)},this.getViewport=function(D){return D.copy(U)},this.setViewport=function(D,K,ie,ce){D.isVector4?U.set(D.x,D.y,D.z,D.w):U.set(D,K,ie,ce),T.viewport(I.copy(U).multiplyScalar(J).floor())},this.getScissor=function(D){return D.copy(V)},this.setScissor=function(D,K,ie,ce){D.isVector4?V.set(D.x,D.y,D.z,D.w):V.set(D,K,ie,ce),T.scissor(N.copy(V).multiplyScalar(J).floor())},this.getScissorTest=function(){return te},this.setScissorTest=function(D){T.setScissorTest(te=D)},this.setOpaqueSort=function(D){Z=D},this.setTransparentSort=function(D){$=D},this.getClearColor=function(D){return D.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor.apply(Ge,arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha.apply(Ge,arguments)},this.clear=function(D=!0,K=!0,ie=!0){let ce=0;if(D){let se=!1;if(M!==null){let me=M.texture.format;se=me===sd||me===rd||me===id}if(se){let me=M.texture.type,be=me===ot||me===Xn||me===Lc||me===ci||me===td||me===nd,De=Ge.getClearColor(),ke=Ge.getClearAlpha(),We=De.r,je=De.g,Ze=De.b;be?(p[0]=We,p[1]=je,p[2]=Ze,p[3]=ke,X.clearBufferuiv(X.COLOR,0,p)):(m[0]=We,m[1]=je,m[2]=Ze,m[3]=ke,X.clearBufferiv(X.COLOR,0,m))}else ce|=X.COLOR_BUFFER_BIT}K&&(ce|=X.DEPTH_BUFFER_BIT),ie&&(ce|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(ce)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ta,!1),t.removeEventListener("webglcontextrestored",hs,!1),t.removeEventListener("webglcontextcreationerror",An,!1),Ue.dispose(),Rt.dispose(),Y.dispose(),oe.dispose(),pe.dispose(),Re.dispose(),Le.dispose(),Ke.dispose(),ve.dispose(),kt.dispose(),kt.removeEventListener("sessionstart",gi),kt.removeEventListener("sessionend",zi),ee&&(ee.dispose(),ee=null),Gi.stop()},this.renderBufferDirect=function(D,K,ie,ce,se,me){K===null&&(K=H);let be=se.isMesh&&se.matrixWorld.determinant()<0,De=(function(Lt,_n,hn,Qe,qe){_n.isScene!==!0&&(_n=H),j.resetTextureUnits();let us=_n.fog,Zo=Qe.isMeshStandardMaterial?_n.environment:null,Ip=M===null?g.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:fn,ra=(Qe.isMeshStandardMaterial?pe:oe).get(Qe.envMap||Zo),Lp=Qe.vertexColors===!0&&!!hn.attributes.color&&hn.attributes.color.itemSize===4,Bp=!!hn.attributes.tangent&&(!!Qe.normalMap||Qe.anisotropy>0),Up=!!hn.morphAttributes.position,Np=!!hn.morphAttributes.normal,Op=!!hn.morphAttributes.color,yh=Ai;Qe.toneMapped&&(M!==null&&M.isXRRenderTarget!==!0||(yh=g.toneMapping));let Eh=hn.morphAttributes.position||hn.morphAttributes.normal||hn.morphAttributes.color,Fp=Eh!==void 0?Eh.length:0,$e=Y.get(Qe),Hp=f.state.lights;if(S===!0&&(G===!0||Lt!==R)){let Tn=Lt===R&&Qe.id===P;Se.setState(Qe,Lt,Tn)}let Pn=!1;Qe.version===$e.__version?$e.needsLights&&$e.lightsStateVersion!==Hp.state.version||$e.outputColorSpace!==Ip||qe.isBatchedMesh&&$e.batching===!1?Pn=!0:qe.isBatchedMesh||$e.batching!==!0?qe.isInstancedMesh&&$e.instancing===!1?Pn=!0:qe.isInstancedMesh||$e.instancing!==!0?qe.isSkinnedMesh&&$e.skinning===!1?Pn=!0:qe.isSkinnedMesh||$e.skinning!==!0?qe.isInstancedMesh&&$e.instancingColor===!0&&qe.instanceColor===null||qe.isInstancedMesh&&$e.instancingColor===!1&&qe.instanceColor!==null||$e.envMap!==ra||Qe.fog===!0&&$e.fog!==us?Pn=!0:$e.numClippingPlanes===void 0||$e.numClippingPlanes===Se.numPlanes&&$e.numIntersection===Se.numIntersection?($e.vertexAlphas!==Lp||$e.vertexTangents!==Bp||$e.morphTargets!==Up||$e.morphNormals!==Np||$e.morphColors!==Op||$e.toneMapping!==yh||ne.isWebGL2===!0&&$e.morphTargetsCount!==Fp)&&(Pn=!0):Pn=!0:Pn=!0:Pn=!0:Pn=!0:(Pn=!0,$e.__version=Qe.version);let Vi=$e.currentProgram;Pn===!0&&(Vi=ia(Qe,_n,qe));let Mh=!1,ds=!1,Qo=!1,qt=Vi.getUniforms(),Wi=$e.uniforms;if(T.useProgram(Vi.program)&&(Mh=!0,ds=!0,Qo=!0),Qe.id!==P&&(P=Qe.id,ds=!0),Mh||R!==Lt){qt.setValue(X,"projectionMatrix",Lt.projectionMatrix),qt.setValue(X,"viewMatrix",Lt.matrixWorldInverse);let Tn=qt.map.cameraPosition;Tn!==void 0&&Tn.setValue(X,F.setFromMatrixPosition(Lt.matrixWorld)),ne.logarithmicDepthBuffer&&qt.setValue(X,"logDepthBufFC",2/(Math.log(Lt.far+1)/Math.LN2)),(Qe.isMeshPhongMaterial||Qe.isMeshToonMaterial||Qe.isMeshLambertMaterial||Qe.isMeshBasicMaterial||Qe.isMeshStandardMaterial||Qe.isShaderMaterial)&&qt.setValue(X,"isOrthographic",Lt.isOrthographicCamera===!0),R!==Lt&&(R=Lt,ds=!0,Qo=!0)}if(qe.isSkinnedMesh){qt.setOptional(X,qe,"bindMatrix"),qt.setOptional(X,qe,"bindMatrixInverse");let Tn=qe.skeleton;Tn&&(ne.floatVertexTextures?(Tn.boneTexture===null&&Tn.computeBoneTexture(),qt.setValue(X,"boneTexture",Tn.boneTexture,j)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}qe.isBatchedMesh&&(qt.setOptional(X,qe,"batchingTexture"),qt.setValue(X,"batchingTexture",qe._matricesTexture,j));let qo=hn.morphAttributes;(qo.position!==void 0||qo.normal!==void 0||qo.color!==void 0&&ne.isWebGL2===!0)&&Hi.update(qe,hn,Vi),(ds||$e.receiveShadow!==qe.receiveShadow)&&($e.receiveShadow=qe.receiveShadow,qt.setValue(X,"receiveShadow",qe.receiveShadow)),Qe.isMeshGouraudMaterial&&Qe.envMap!==null&&(Wi.envMap.value=ra,Wi.flipEnvMap.value=ra.isCubeTexture&&ra.isRenderTargetTexture===!1?-1:1),ds&&(qt.setValue(X,"toneMappingExposure",g.toneMappingExposure),$e.needsLights&&(In=Qo,(Gn=Wi).ambientLightColor.needsUpdate=In,Gn.lightProbe.needsUpdate=In,Gn.directionalLights.needsUpdate=In,Gn.directionalLightShadows.needsUpdate=In,Gn.pointLights.needsUpdate=In,Gn.pointLightShadows.needsUpdate=In,Gn.spotLights.needsUpdate=In,Gn.spotLightShadows.needsUpdate=In,Gn.rectAreaLights.needsUpdate=In,Gn.hemisphereLights.needsUpdate=In),us&&Qe.fog===!0&&ye.refreshFogUniforms(Wi,us),ye.refreshMaterialUniforms(Wi,Qe,J,le,ee),Xr.upload(X,vh($e),Wi,j));var Gn,In;if(Qe.isShaderMaterial&&Qe.uniformsNeedUpdate===!0&&(Xr.upload(X,vh($e),Wi,j),Qe.uniformsNeedUpdate=!1),Qe.isSpriteMaterial&&qt.setValue(X,"center",qe.center),qt.setValue(X,"modelViewMatrix",qe.modelViewMatrix),qt.setValue(X,"normalMatrix",qe.normalMatrix),qt.setValue(X,"modelMatrix",qe.matrixWorld),Qe.isShaderMaterial||Qe.isRawShaderMaterial){let Tn=Qe.uniformsGroups;for(let Ko=0,zp=Tn.length;Ko<zp;Ko++)if(ne.isWebGL2){let wh=Tn[Ko];Ke.update(wh,Vi),Ke.bind(wh,Vi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Vi})(D,K,ie,ce,se);T.setMaterial(ce,be);let ke=ie.index,We=1;if(ce.wireframe===!0){if(ke=xe.getWireframeAttribute(ie),ke===void 0)return;We=2}let je=ie.drawRange,Ze=ie.attributes.position,Et=je.start*We,Dn=(je.start+je.count)*We;me!==null&&(Et=Math.max(Et,me.start*We),Dn=Math.min(Dn,(me.start+me.count)*We)),ke!==null?(Et=Math.max(Et,0),Dn=Math.min(Dn,ke.count)):Ze!=null&&(Et=Math.max(Et,0),Dn=Math.min(Dn,Ze.count));let ni=Dn-Et;if(ni<0||ni===1/0)return;let ki;Le.setup(se,ce,De,ie,ke);let Mt=xn;if(ke!==null&&(ki=fe.get(ke),Mt=B,Mt.setIndex(ki)),se.isMesh)ce.wireframe===!0?(T.setLineWidth(ce.wireframeLinewidth*W()),Mt.setMode(X.LINES)):Mt.setMode(X.TRIANGLES);else if(se.isLine){let Lt=ce.linewidth;Lt===void 0&&(Lt=1),T.setLineWidth(Lt*W()),se.isLineSegments?Mt.setMode(X.LINES):se.isLineLoop?Mt.setMode(X.LINE_LOOP):Mt.setMode(X.LINE_STRIP)}else se.isPoints?Mt.setMode(X.POINTS):se.isSprite&&Mt.setMode(X.TRIANGLES);if(se.isBatchedMesh)Mt.renderMultiDraw(se._multiDrawStarts,se._multiDrawCounts,se._multiDrawCount);else if(se.isInstancedMesh)Mt.renderInstances(Et,ni,se.count);else if(ie.isInstancedBufferGeometry){let Lt=ie._maxInstanceCount!==void 0?ie._maxInstanceCount:1/0,_n=Math.min(ie.instanceCount,Lt);Mt.renderInstances(Et,ni,_n)}else Mt.render(Et,ni)},this.compile=function(D,K,ie=null){ie===null&&(ie=D),f=Rt.get(ie),f.init(),v.push(f),ie.traverseVisible((function(se){se.isLight&&se.layers.test(K.layers)&&(f.pushLight(se),se.castShadow&&f.pushShadow(se))})),D!==ie&&D.traverseVisible((function(se){se.isLight&&se.layers.test(K.layers)&&(f.pushLight(se),se.castShadow&&f.pushShadow(se))})),f.setupLights(g._useLegacyLights);let ce=new Set;return D.traverse((function(se){let me=se.material;if(me)if(Array.isArray(me))for(let be=0;be<me.length;be++){let De=me[be];Mr(De,ie,se),ce.add(De)}else Mr(me,ie,se),ce.add(me)})),v.pop(),f=null,ce},this.compileAsync=function(D,K,ie=null){let ce=this.compile(D,K,ie);return new Promise((se=>{function me(){ce.forEach((function(be){Y.get(be).currentProgram.isReady()&&ce.delete(be)})),ce.size!==0?setTimeout(me,10):se(D)}re.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)}))};let ti=null;function gi(){Gi.stop()}function zi(){Gi.start()}let Gi=new ud;function fh(D,K,ie,ce){if(D.visible===!1)return;if(D.layers.test(K.layers)){if(D.isGroup)ie=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(K);else if(D.isLight)f.pushLight(D),D.castShadow&&f.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||A.intersectsSprite(D)){ce&&F.setFromMatrixPosition(D.matrixWorld).applyMatrix4(L);let me=Re.update(D),be=D.material;be.visible&&x.push(D,me,be,ie,F.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||A.intersectsObject(D))){let me=Re.update(D),be=D.material;if(ce&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),F.copy(D.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),F.copy(me.boundingSphere.center)),F.applyMatrix4(D.matrixWorld).applyMatrix4(L)),Array.isArray(be)){let De=me.groups;for(let ke=0,We=De.length;ke<We;ke++){let je=De[ke],Ze=be[je.materialIndex];Ze&&Ze.visible&&x.push(D,me,Ze,ie,F.z,je)}}else be.visible&&x.push(D,me,be,ie,F.z,null)}}let se=D.children;for(let me=0,be=se.length;me<be;me++)fh(se[me],K,ie,ce)}function mh(D,K,ie,ce){let se=D.opaque,me=D.transmissive,be=D.transparent;f.setupLightsView(ie),S===!0&&Se.setGlobalState(g.clippingPlanes,ie),me.length>0&&(function(De,ke,We,je){if((We.isScene===!0?We.overrideMaterial:null)!==null)return;let Et=ne.isWebGL2;ee===null&&(ee=new Fe(1,1,{generateMipmaps:!0,type:re.has("EXT_color_buffer_half_float")?tr:ot,minFilter:Cs,samples:Et?4:0})),g.getDrawingBufferSize(Q),Et?ee.setSize(Q.x,Q.y):ee.setSize(Xa(Q.x),Xa(Q.y));let Dn=g.getRenderTarget();g.setRenderTarget(ee),g.getClearColor(z),O=g.getClearAlpha(),O<1&&g.setClearColor(16777215,.5),g.clear();let ni=g.toneMapping;g.toneMapping=Ai,na(De,We,je),j.updateMultisampleRenderTarget(ee),j.updateRenderTargetMipmap(ee);let ki=!1;for(let Mt=0,Lt=ke.length;Mt<Lt;Mt++){let _n=ke[Mt],hn=_n.object,Qe=_n.geometry,qe=_n.material,us=_n.group;if(qe.side===2&&hn.layers.test(je.layers)){let Zo=qe.side;qe.side=Tt,qe.needsUpdate=!0,gh(hn,We,je,Qe,qe,us),qe.side=Zo,qe.needsUpdate=!0,ki=!0}}ki===!0&&(j.updateMultisampleRenderTarget(ee),j.updateRenderTargetMipmap(ee)),g.setRenderTarget(Dn),g.setClearColor(z,O),g.toneMapping=ni})(se,me,K,ie),ce&&T.viewport(I.copy(ce)),se.length>0&&na(se,K,ie),me.length>0&&na(me,K,ie),be.length>0&&na(be,K,ie),T.buffers.depth.setTest(!0),T.buffers.depth.setMask(!0),T.buffers.color.setMask(!0),T.setPolygonOffset(!1)}function na(D,K,ie){let ce=K.isScene===!0?K.overrideMaterial:null;for(let se=0,me=D.length;se<me;se++){let be=D[se],De=be.object,ke=be.geometry,We=ce===null?be.material:ce,je=be.group;De.layers.test(ie.layers)&&gh(De,K,ie,ke,We,je)}}function gh(D,K,ie,ce,se,me){D.onBeforeRender(g,K,ie,ce,se,me),D.modelViewMatrix.multiplyMatrices(ie.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),se.onBeforeRender(g,K,ie,ce,D,me),se.transparent===!0&&se.side===2&&se.forceSinglePass===!1?(se.side=Tt,se.needsUpdate=!0,g.renderBufferDirect(ie,K,ce,se,D,me),se.side=jn,se.needsUpdate=!0,g.renderBufferDirect(ie,K,ce,se,D,me),se.side=2):g.renderBufferDirect(ie,K,ce,se,D,me),D.onAfterRender(g,K,ie,ce,se,me)}function ia(D,K,ie){K.isScene!==!0&&(K=H);let ce=Y.get(D),se=f.state.lights,me=f.state.shadowsArray,be=se.state.version,De=ve.getParameters(D,se.state,me,K,ie),ke=ve.getProgramCacheKey(De),We=ce.programs;ce.environment=D.isMeshStandardMaterial?K.environment:null,ce.fog=K.fog,ce.envMap=(D.isMeshStandardMaterial?pe:oe).get(D.envMap||ce.environment),We===void 0&&(D.addEventListener("dispose",Sn),We=new Map,ce.programs=We);let je=We.get(ke);if(je!==void 0){if(ce.currentProgram===je&&ce.lightsStateVersion===be)return xh(D,De),je}else De.uniforms=ve.getUniforms(D),D.onBuild(ie,De,g),D.onBeforeCompile(De,g),je=ve.acquireProgram(De,ke),We.set(ke,je),ce.uniforms=De.uniforms;let Ze=ce.uniforms;return(D.isShaderMaterial||D.isRawShaderMaterial)&&D.clipping!==!0||(Ze.clippingPlanes=Se.uniform),xh(D,De),ce.needsLights=(function(Et){return Et.isMeshLambertMaterial||Et.isMeshToonMaterial||Et.isMeshPhongMaterial||Et.isMeshStandardMaterial||Et.isShadowMaterial||Et.isShaderMaterial&&Et.lights===!0})(D),ce.lightsStateVersion=be,ce.needsLights&&(Ze.ambientLightColor.value=se.state.ambient,Ze.lightProbe.value=se.state.probe,Ze.directionalLights.value=se.state.directional,Ze.directionalLightShadows.value=se.state.directionalShadow,Ze.spotLights.value=se.state.spot,Ze.spotLightShadows.value=se.state.spotShadow,Ze.rectAreaLights.value=se.state.rectArea,Ze.ltc_1.value=se.state.rectAreaLTC1,Ze.ltc_2.value=se.state.rectAreaLTC2,Ze.pointLights.value=se.state.point,Ze.pointLightShadows.value=se.state.pointShadow,Ze.hemisphereLights.value=se.state.hemi,Ze.directionalShadowMap.value=se.state.directionalShadowMap,Ze.directionalShadowMatrix.value=se.state.directionalShadowMatrix,Ze.spotShadowMap.value=se.state.spotShadowMap,Ze.spotLightMatrix.value=se.state.spotLightMatrix,Ze.spotLightMap.value=se.state.spotLightMap,Ze.pointShadowMap.value=se.state.pointShadowMap,Ze.pointShadowMatrix.value=se.state.pointShadowMatrix),ce.currentProgram=je,ce.uniformsList=null,je}function vh(D){if(D.uniformsList===null){let K=D.currentProgram.getUniforms();D.uniformsList=Xr.seqWithValue(K.seq,D.uniforms)}return D.uniformsList}function xh(D,K){let ie=Y.get(D);ie.outputColorSpace=K.outputColorSpace,ie.batching=K.batching,ie.instancing=K.instancing,ie.instancingColor=K.instancingColor,ie.skinning=K.skinning,ie.morphTargets=K.morphTargets,ie.morphNormals=K.morphNormals,ie.morphColors=K.morphColors,ie.morphTargetsCount=K.morphTargetsCount,ie.numClippingPlanes=K.numClippingPlanes,ie.numIntersection=K.numClipIntersection,ie.vertexAlphas=K.vertexAlphas,ie.vertexTangents=K.vertexTangents,ie.toneMapping=K.toneMapping}Gi.setAnimationLoop((function(D){ti&&ti(D)})),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(D){ti=D,kt.setAnimationLoop(D),D===null?Gi.stop():Gi.start()},kt.addEventListener("sessionstart",gi),kt.addEventListener("sessionend",zi),this.render=function(D,K){if(K!==void 0&&K.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(w===!0)return;D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),kt.enabled===!0&&kt.isPresenting===!0&&(kt.cameraAutoUpdate===!0&&kt.updateCamera(K),K=kt.getCamera()),D.isScene===!0&&D.onBeforeRender(g,D,K,M),f=Rt.get(D,v.length),f.init(),v.push(f),L.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),A.setFromProjectionMatrix(L),G=this.localClippingEnabled,S=Se.init(this.clippingPlanes,G),x=Ue.get(D,y.length),x.init(),y.push(x),fh(D,K,0,g.sortObjects),x.finish(),g.sortObjects===!0&&x.sort(Z,$),this.info.render.frame++,S===!0&&Se.beginShadows();let ie=f.state.shadowsArray;if(Ye.render(ie,D,K),S===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ge.render(x,D),f.setupLights(g._useLegacyLights),K.isArrayCamera){let ce=K.cameras;for(let se=0,me=ce.length;se<me;se++){let be=ce[se];mh(x,D,be,be.viewport)}}else mh(x,D,K);M!==null&&(j.updateMultisampleRenderTarget(M),j.updateRenderTargetMipmap(M)),D.isScene===!0&&D.onAfterRender(g,D,K),Le.resetDefaultState(),P=-1,R=null,v.pop(),f=v.length>0?v[v.length-1]:null,y.pop(),x=y.length>0?y[y.length-1]:null},this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return _},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(D,K,ie){Y.get(D.texture).__webglTexture=K,Y.get(D.depthTexture).__webglTexture=ie;let ce=Y.get(D);ce.__hasExternalTextures=!0,ce.__hasExternalTextures&&(ce.__autoAllocateDepthBuffer=ie===void 0,ce.__autoAllocateDepthBuffer||re.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ce.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(D,K){let ie=Y.get(D);ie.__webglFramebuffer=K,ie.__useDefaultFramebuffer=K===void 0},this.setRenderTarget=function(D,K=0,ie=0){M=D,b=K,_=ie;let ce=!0,se=null,me=!1,be=!1;if(D){let De=Y.get(D);De.__useDefaultFramebuffer!==void 0?(T.bindFramebuffer(X.FRAMEBUFFER,null),ce=!1):De.__webglFramebuffer===void 0?j.setupRenderTarget(D):De.__hasExternalTextures&&j.rebindTextures(D,Y.get(D.texture).__webglTexture,Y.get(D.depthTexture).__webglTexture);let ke=D.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(be=!0);let We=Y.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(se=Array.isArray(We[K])?We[K][ie]:We[K],me=!0):se=ne.isWebGL2&&D.samples>0&&j.useMultisampledRTT(D)===!1?Y.get(D).__webglMultisampledFramebuffer:Array.isArray(We)?We[ie]:We,I.copy(D.viewport),N.copy(D.scissor),C=D.scissorTest}else I.copy(U).multiplyScalar(J).floor(),N.copy(V).multiplyScalar(J).floor(),C=te;if(T.bindFramebuffer(X.FRAMEBUFFER,se)&&ne.drawBuffers&&ce&&T.drawBuffers(D,se),T.viewport(I),T.scissor(N),T.setScissorTest(C),me){let De=Y.get(D.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+K,De.__webglTexture,ie)}else if(be){let De=Y.get(D.texture),ke=K||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,De.__webglTexture,ie||0,ke)}P=-1},this.readRenderTargetPixels=function(D,K,ie,ce,se,me,be){if(!D||!D.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=Y.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&be!==void 0&&(De=De[be]),De){T.bindFramebuffer(X.FRAMEBUFFER,De);try{let ke=D.texture,We=ke.format,je=ke.type;if(We!==un&&ge.convert(We)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");let Ze=je===tr&&(re.has("EXT_color_buffer_half_float")||ne.isWebGL2&&re.has("EXT_color_buffer_float"));if(!(je===ot||ge.convert(je)===X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)||je===pn&&(ne.isWebGL2||re.has("OES_texture_float")||re.has("WEBGL_color_buffer_float"))||Ze))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");K>=0&&K<=D.width-ce&&ie>=0&&ie<=D.height-se&&X.readPixels(K,ie,ce,se,ge.convert(We),ge.convert(je),me)}finally{let ke=M!==null?Y.get(M).__webglFramebuffer:null;T.bindFramebuffer(X.FRAMEBUFFER,ke)}}},this.copyFramebufferToTexture=function(D,K,ie=0){let ce=Math.pow(2,-ie),se=Math.floor(K.image.width*ce),me=Math.floor(K.image.height*ce);j.setTexture2D(K,0),X.copyTexSubImage2D(X.TEXTURE_2D,ie,0,0,D.x,D.y,se,me),T.unbindTexture()},this.copyTextureToTexture=function(D,K,ie,ce=0){let se=K.image.width,me=K.image.height,be=ge.convert(ie.format),De=ge.convert(ie.type);j.setTexture2D(ie,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,ie.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ie.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,ie.unpackAlignment),K.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,ce,D.x,D.y,se,me,be,De,K.image.data):K.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,ce,D.x,D.y,K.mipmaps[0].width,K.mipmaps[0].height,be,K.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,ce,D.x,D.y,be,De,K.image),ce===0&&ie.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),T.unbindTexture()},this.copyTextureToTexture3D=function(D,K,ie,ce,se=0){if(g.isWebGL1Renderer)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");let me=D.max.x-D.min.x+1,be=D.max.y-D.min.y+1,De=D.max.z-D.min.z+1,ke=ge.convert(ce.format),We=ge.convert(ce.type),je;if(ce.isData3DTexture)j.setTexture3D(ce,0),je=X.TEXTURE_3D;else{if(!ce.isDataArrayTexture&&!ce.isCompressedArrayTexture)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");j.setTexture2DArray(ce,0),je=X.TEXTURE_2D_ARRAY}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,ce.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ce.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,ce.unpackAlignment);let Ze=X.getParameter(X.UNPACK_ROW_LENGTH),Et=X.getParameter(X.UNPACK_IMAGE_HEIGHT),Dn=X.getParameter(X.UNPACK_SKIP_PIXELS),ni=X.getParameter(X.UNPACK_SKIP_ROWS),ki=X.getParameter(X.UNPACK_SKIP_IMAGES),Mt=ie.isCompressedTexture?ie.mipmaps[se]:ie.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,Mt.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Mt.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,D.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,D.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,D.min.z),ie.isDataTexture||ie.isData3DTexture?X.texSubImage3D(je,se,K.x,K.y,K.z,me,be,De,ke,We,Mt.data):ie.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(je,se,K.x,K.y,K.z,me,be,De,ke,Mt.data)):X.texSubImage3D(je,se,K.x,K.y,K.z,me,be,De,ke,We,Mt),X.pixelStorei(X.UNPACK_ROW_LENGTH,Ze),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Et),X.pixelStorei(X.UNPACK_SKIP_PIXELS,Dn),X.pixelStorei(X.UNPACK_SKIP_ROWS,ni),X.pixelStorei(X.UNPACK_SKIP_IMAGES,ki),se===0&&ce.generateMipmaps&&X.generateMipmap(je),T.unbindTexture()},this.initTexture=function(D){D.isCubeTexture?j.setTextureCube(D,0):D.isData3DTexture?j.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?j.setTexture2DArray(D,0):j.setTexture2D(D,0),T.unbindTexture()},this.resetState=function(){b=0,_=0,M=null,T.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Bc?"display-p3":"srgb",t.unpackColorSpace=dt.workingColorSpace===Eo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?er:od}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===er?Ae:fn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},nc=class extends Ps{};nc.prototype.isWebGL1Renderer=!0;var ro=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new he(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},bi=class extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}},ic=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=zl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Yn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Yn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},an=new E,so=class n{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)an.fromBufferAttribute(this,t),an.applyMatrix4(e),this.setXYZ(t,an.x,an.y,an.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)an.fromBufferAttribute(this,t),an.applyNormalMatrix(e),this.setXYZ(t,an.x,an.y,an.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)an.fromBufferAttribute(this,t),an.transformDirection(e),this.setXYZ(t,an.x,an.y,an.z);return this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Wn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Wn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Wn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Wn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Is=class extends wn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new he(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Fr,xs=new E,Hr=new E,zr=new E,Gr=new k,ys=new k,vd=new Ne,ba=new E,Es=new E,Ca=new E,Ou=new k,bl=new k,Fu=new k,ao=class extends Wt{constructor(e=new Is){if(super(),this.isSprite=!0,this.type="Sprite",Fr===void 0){Fr=new tt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new ic(t,5);Fr.setIndex([0,1,2,0,2,3]),Fr.setAttribute("position",new so(i,3,0,!1)),Fr.setAttribute("uv",new so(i,2,3,!1))}this.geometry=Fr,this.material=e,this.center=new k(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hr.setFromMatrixScale(this.matrixWorld),vd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),zr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hr.multiplyScalar(-zr.z);let i=this.material.rotation,r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));let a=this.center;Ra(ba.set(-.5,-.5,0),zr,a,Hr,r,s),Ra(Es.set(.5,-.5,0),zr,a,Hr,r,s),Ra(Ca.set(.5,.5,0),zr,a,Hr,r,s),Ou.set(0,0),bl.set(1,0),Fu.set(1,1);let o=e.ray.intersectTriangle(ba,Es,Ca,!1,xs);if(o===null&&(Ra(Es.set(-.5,.5,0),zr,a,Hr,r,s),bl.set(0,1),o=e.ray.intersectTriangle(ba,Ca,Es,!1,xs),o===null))return;let l=e.ray.origin.distanceTo(xs);l<e.near||l>e.far||t.push({distance:l,point:xs.clone(),uv:wi.getInterpolation(xs,ba,Es,Ca,Ou,bl,Fu,new k),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Ra(n,e,t,i,r,s){Gr.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(ys.x=s*Gr.x-r*Gr.y,ys.y=r*Gr.x+s*Gr.y):ys.copy(Gr),n.copy(e),n.x+=ys.x,n.y+=ys.y,n.applyMatrix4(vd)}var e1=new E,t1=new E;var n1=new E,i1=new et,r1=new et,s1=new E,a1=new Ne,o1=new E,l1=new Qn,c1=new Ne,h1=new Ti;var u1=new Ne,d1=new Ne;var p1=new Ne,f1=new Ne;var m1=new Zn,g1=new Ne,v1=new Je,x1=new Qn;var rc=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t){let i=this.pool,r=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1});let s=i[this.index];r.push(s),this.index++,s.start=e.start,s.count=e.count,s.z=t}reset(){this.list.length=0,this.index=0}};var y1=new Ne,E1=new Ne,M1=new Ne,w1=new Ne,A1=new Kr,S1=new Zn,_1=new Qn,T1=new E,b1=new rc,C1=new Je;var R1=new E,D1=new E,P1=new Ne,I1=new Ti,L1=new Qn;var B1=new E,U1=new E;var Ls=class extends wn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Hu=new Ne,sc=new Ti,Da=new Qn,Pa=new E,oo=class extends Wt{constructor(e=new tt,t=new Ls){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Da.copy(i.boundingSphere),Da.applyMatrix4(r),Da.radius+=s,e.ray.intersectsSphere(Da)===!1)return;Hu.copy(r).invert(),sc.copy(e.ray).applyMatrix4(Hu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null)for(let u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);u<d;u++){let p=c.getX(u);Pa.fromBufferAttribute(h,p),zu(Pa,p,l,r,e,t,this)}else for(let u=Math.max(0,a.start),d=Math.min(h.count,a.start+a.count);u<d;u++)Pa.fromBufferAttribute(h,u),zu(Pa,u,l,r,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function zu(n,e,t,i,r,s,a){let o=sc.distanceSqToPoint(n);if(o<t){let l=new E;sc.closestPointToPoint(n,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}var Jr=class extends Vt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Cn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),r=0,s=i.length,a;a=t||e*i[s-1];let o,l=0,c=s-1;for(;l<=c;)if(r=Math.floor(l+(c-l)/2),o=i[r]-a,o<0)l=r+1;else{if(!(o>0)){c=r;break}c=r-1}if(r=c,i[r]===a)return r/(s-1);let h=i[r];return(r+(a-h)/(i[r+1]-h))/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new k:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new E,r=[],s=[],a=[],o=new E,l=new Ne;for(let p=0;p<=e;p++){let m=p/e;r[p]=this.getTangentAt(m,new E)}s[0]=new E,a[0]=new E;let c=Number.MAX_VALUE,h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(r[p-1],r[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Bt(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,m))}a[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(Bt(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],p*m)),a[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Bs=class extends Cn{constructor(e=0,t=0,i=1,r=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){let i=t||new k,r=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(s=a?0:r),this.aClockwise!==!0||a||(s===r?s=-r:s-=r);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ac=class extends Bs{constructor(e,t,i,r,s,a){super(e,t,i,i,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Nc(){let n=0,e=0,t=0,i=0;function r(s,a,o,l){n=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,r(a,o,d,p)},calc:function(s){let a=s*s;return n+e*s+t*a+i*(a*s)}}}var Ia=new E,Cl=new Nc,Rl=new Nc,Dl=new Nc,Ci=class extends Cn{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new E){let i=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=r[(c-1)%s]:(Ia.subVectors(r[0],r[1]).add(r[0]),o=Ia);let u=r[c%s],d=r[(c+1)%s];if(this.closed||c+2<s?l=r[(c+2)%s]:(Ia.subVectors(r[s-1],r[s-2]).add(r[s-1]),l=Ia),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(l),p);x<1e-4&&(x=1),m<1e-4&&(m=x),f<1e-4&&(f=x),Cl.initNonuniformCatmullRom(o.x,u.x,d.x,l.x,m,x,f),Rl.initNonuniformCatmullRom(o.y,u.y,d.y,l.y,m,x,f),Dl.initNonuniformCatmullRom(o.z,u.z,d.z,l.z,m,x,f)}else this.curveType==="catmullrom"&&(Cl.initCatmullRom(o.x,u.x,d.x,l.x,this.tension),Rl.initCatmullRom(o.y,u.y,d.y,l.y,this.tension),Dl.initCatmullRom(o.z,u.z,d.z,l.z,this.tension));return i.set(Cl.calc(h),Rl.calc(h),Dl.calc(h)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new E().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Gu(n,e,t,i,r){let s=.5*(i-e),a=.5*(r-t),o=n*n;return(2*t-2*i+s+a)*(n*o)+(-3*t+3*i-2*s-a)*o+s*n+t}function _s(n,e,t,i){return(function(r,s){let a=1-r;return a*a*s})(n,e)+(function(r,s){return 2*(1-r)*r*s})(n,t)+(function(r,s){return r*r*s})(n,i)}function Ts(n,e,t,i,r){return(function(s,a){let o=1-s;return o*o*o*a})(n,e)+(function(s,a){let o=1-s;return 3*o*o*s*a})(n,t)+(function(s,a){return 3*(1-s)*s*s*a})(n,i)+(function(s,a){return s*s*s*a})(n,r)}var lo=class extends Cn{constructor(e=new k,t=new k,i=new k,r=new k){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new k){let i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Ts(e,r.x,s.x,a.x,o.x),Ts(e,r.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},oc=class extends Cn{constructor(e=new E,t=new E,i=new E,r=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new E){let i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Ts(e,r.x,s.x,a.x,o.x),Ts(e,r.y,s.y,a.y,o.y),Ts(e,r.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},co=class extends Cn{constructor(e=new k,t=new k){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new k){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},lc=class extends Cn{constructor(e=new E,t=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new E){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new E){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ho=class extends Cn{constructor(e=new k,t=new k,i=new k){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new k){let i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(_s(e,r.x,s.x,a.x),_s(e,r.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},uo=class extends Cn{constructor(e=new E,t=new E,i=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new E){let i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(_s(e,r.x,s.x,a.x),_s(e,r.y,s.y,a.y),_s(e,r.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},po=class extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new k){let i=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return i.set(Gu(o,l.x,c.x,h.x,u.x),Gu(o,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new k().fromArray(r))}return this}},fo=Object.freeze({__proto__:null,ArcCurve:ac,CatmullRomCurve3:Ci,CubicBezierCurve:lo,CubicBezierCurve3:oc,EllipseCurve:Bs,LineCurve:co,LineCurve3:lc,QuadraticBezierCurve:ho,QuadraticBezierCurve3:uo,SplineCurve:po}),cc=class extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fo[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=i){let a=r[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let r=0,s=this.curves;r<s.length;r++){let a=s[r],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(new fo[r.type]().fromJSON(r))}return this}},Us=class extends cc{constructor(e){super(),this.type="Path",this.currentPoint=new k,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new co(this.currentPoint.clone(),new k(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){let s=new ho(this.currentPoint.clone(),new k(e,t),new k(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,a){let o=new lo(this.currentPoint.clone(),new k(e,t),new k(i,r),new k(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new po(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,r,s,a),this}absarc(e,t,i,r,s,a){return this.absellipse(e,t,i,i,r,s,a),this}ellipse(e,t,i,r,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,r,s,a,o,l),this}absellipse(e,t,i,r,s,a,o,l){let c=new Bs(e,t,i,r,s,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},mo=class n extends tt{constructor(e=[new k(0,-.5),new k(.5,0),new k(0,.5)],t=12,i=0,r=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=Bt(r,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,u=new E,d=new k,p=new E,m=new E,x=new E,f=0,y=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:f=e[v+1].x-e[v].x,y=e[v+1].y-e[v].y,p.x=1*y,p.y=-f,p.z=0*y,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:f=e[v+1].x-e[v].x,y=e[v+1].y-e[v].y,p.x=1*y,p.y=-f,p.z=0*y,m.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(m)}for(let v=0;v<=t;v++){let g=i+v*h*r,w=Math.sin(g),b=Math.cos(g);for(let _=0;_<=e.length-1;_++){u.x=e[_].x*w,u.y=e[_].y,u.z=e[_].x*b,a.push(u.x,u.y,u.z),d.x=v/t,d.y=_/(e.length-1),o.push(d.x,d.y);let M=l[3*_+0]*w,P=l[3*_+1],R=l[3*_+0]*b;c.push(M,P,R)}}for(let v=0;v<t;v++)for(let g=0;g<e.length-1;g++){let w=g+v*e.length,b=w,_=w+e.length,M=w+e.length+1,P=w+1;s.push(b,_,P),s.push(M,P,_)}this.setIndex(s),this.setAttribute("position",new _e(a,3)),this.setAttribute("uv",new _e(o,2)),this.setAttribute("normal",new _e(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}},hc=class n extends mo{constructor(e=1,t=1,i=4,r=8){let s=new Us;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(i),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:r}}static fromJSON(e){return new n(e.radius,e.length,e.capSegments,e.radialSegments)}},uc=class n extends tt{constructor(e=1,t=32,i=0,r=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new E,h=new k;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=i+u/t*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new _e(a,3)),this.setAttribute("normal",new _e(o,3)),this.setAttribute("uv",new _e(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},nt=class n extends tt{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],u=[],d=[],p=[],m=0,x=[],f=i/2,y=0;function v(g){let w=m,b=new k,_=new E,M=0,P=g===!0?e:t,R=g===!0?1:-1;for(let N=1;N<=r;N++)u.push(0,f*R,0),d.push(0,R,0),p.push(.5,.5),m++;let I=m;for(let N=0;N<=r;N++){let C=N/r*l+o,z=Math.cos(C),O=Math.sin(C);_.x=P*O,_.y=f*R,_.z=P*z,u.push(_.x,_.y,_.z),d.push(0,R,0),b.x=.5*z+.5,b.y=.5*O*R+.5,p.push(b.x,b.y),m++}for(let N=0;N<r;N++){let C=w+N,z=I+N;g===!0?h.push(z,z+1,C):h.push(z+1,z,C),M+=3}c.addGroup(y,M,g===!0?1:2),y+=M}(function(){let g=new E,w=new E,b=0,_=(t-e)/i;for(let M=0;M<=s;M++){let P=[],R=M/s,I=R*(t-e)+e;for(let N=0;N<=r;N++){let C=N/r,z=C*l+o,O=Math.sin(z),q=Math.cos(z);w.x=I*O,w.y=-R*i+f,w.z=I*q,u.push(w.x,w.y,w.z),g.set(O,_,q).normalize(),d.push(g.x,g.y,g.z),p.push(C,1-R),P.push(m++)}x.push(P)}for(let M=0;M<r;M++)for(let P=0;P<s;P++){let R=x[P][M],I=x[P+1][M],N=x[P+1][M+1],C=x[P][M+1];h.push(R,I,C),h.push(I,N,C),b+=6}c.addGroup(y,b,0),y+=b})(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new _e(u,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},yt=class n extends nt{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},rr=class n extends tt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};let s=[],a=[];function o(d,p,m,x){let f=x+1,y=[];for(let v=0;v<=f;v++){y[v]=[];let g=d.clone().lerp(m,v/f),w=p.clone().lerp(m,v/f),b=f-v;for(let _=0;_<=b;_++)y[v][_]=_===0&&v===f?g:g.clone().lerp(w,_/b)}for(let v=0;v<f;v++)for(let g=0;g<2*(f-v)-1;g++){let w=Math.floor(g/2);g%2==0?(l(y[v][w+1]),l(y[v+1][w]),l(y[v][w])):(l(y[v][w+1]),l(y[v+1][w+1]),l(y[v+1][w]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,p){let m=3*d;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function h(d,p,m,x){x<0&&d.x===1&&(a[p]=d.x-1),m.x===0&&m.z===0&&(a[p]=x/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new E,m=new E,x=new E;for(let f=0;f<t.length;f+=3)c(t[f+0],p),c(t[f+1],m),c(t[f+2],x),o(p,m,x,d)})(r),(function(d){let p=new E;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(d),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z})(i),(function(){let d=new E;for(let m=0;m<s.length;m+=3){d.x=s[m+0],d.y=s[m+1],d.z=s[m+2];let x=u(d)/2/Math.PI+.5,f=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(x,1-f)}var p;(function(){let m=new E,x=new E,f=new E,y=new E,v=new k,g=new k,w=new k;for(let b=0,_=0;b<s.length;b+=9,_+=6){m.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),f.set(s[b+6],s[b+7],s[b+8]),v.set(a[_+0],a[_+1]),g.set(a[_+2],a[_+3]),w.set(a[_+4],a[_+5]),y.copy(m).add(x).add(f).divideScalar(3);let M=u(y);h(v,_+0,m,M),h(g,_+2,x,M),h(w,_+4,f,M)}})(),(function(){for(let m=0;m<a.length;m+=6){let x=a[m+0],f=a[m+2],y=a[m+4],v=Math.max(x,f,y),g=Math.min(x,f,y);v>.9&&g<.1&&(x<.2&&(a[m+0]+=1),f<.2&&(a[m+2]+=1),y<.2&&(a[m+4]+=1))}})()})(),this.setAttribute("position",new _e(s,3)),this.setAttribute("normal",new _e(s.slice(),3)),this.setAttribute("uv",new _e(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}},sr=class n extends rr{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,r=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},La=new E,Ba=new E,Pl=new E,Ua=new wi,dc=class extends tt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(Vr*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:x,b:f,c:y}=Ua;if(x.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),y.fromBufferAttribute(o,c[2]),Ua.getNormal(Pl),u[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,u[1]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,u[2]=`${Math.round(y.x*r)},${Math.round(y.y*r)},${Math.round(y.z*r)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let v=0;v<3;v++){let g=(v+1)%3,w=u[v],b=u[g],_=Ua[h[v]],M=Ua[h[g]],P=`${w}_${b}`,R=`${b}_${w}`;R in d&&d[R]?(Pl.dot(d[R].normal)<=s&&(p.push(_.x,_.y,_.z),p.push(M.x,M.y,M.z)),d[R]=null):P in d||(d[P]={index0:c[v],index1:c[g],normal:Pl.clone()})}}for(let m in d)if(d[m]){let{index0:x,index1:f}=d[m];La.fromBufferAttribute(o,x),Ba.fromBufferAttribute(o,f),p.push(La.x,La.y,La.z),p.push(Ba.x,Ba.y,Ba.z)}this.setAttribute("position",new _e(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},ui=class extends Us{constructor(e){super(e),this.uuid=Yn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(new Us().fromJSON(r))}return this}},k0=function(n,e,t=2){let i=e&&e.length,r=i?e[0]*t:n.length,s=ku(n,0,r,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,p;if(i&&(s=(function(m,x,f,y){let v=[],g,w,b,_,M;for(g=0,w=x.length;g<w;g++)b=x[g]*y,_=g<w-1?x[g+1]*y:m.length,M=ku(m,b,_,y,!1),M===M.next&&(M.steiner=!0),v.push(q0(M));for(v.sort(j0),g=0;g<v.length;g++)f=Z0(v[g],f);return f})(n,e,s,t)),n.length>80*t){o=c=n[0],l=h=n[1];for(let m=t;m<r;m+=t)u=n[m],d=n[m+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return Ns(s,a,t,o,l,p,0),a};function ku(n,e,t,i,r){let s,a;if(r===(function(o,l,c,h){let u=0;for(let d=l,p=c-h;d<c;d+=h)u+=(o[p]-o[d])*(o[d+1]+o[p+1]),p=d;return u})(n,e,t,i)>0)for(s=e;s<t;s+=i)a=Vu(s,n[s],n[s+1],a);else for(s=t-i;s>=e;s-=i)a=Vu(s,n[s],n[s+1],a);return a&&wo(a,a.next)&&(Fs(a),a=a.next),a}function ar(n,e){if(!n)return n;e||(e=n);let t,i=n;do if(t=!1,i.steiner||!wo(i,i.next)&&St(i.prev,i,i.next)!==0)i=i.next;else{if(Fs(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function Ns(n,e,t,i,r,s,a){if(!n)return;!a&&s&&(function(h,u,d,p){let m=h;do m.z===0&&(m.z=pc(m.x,m.y,u,d,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==h);m.prevZ.nextZ=null,m.prevZ=null,(function(x){let f,y,v,g,w,b,_,M,P=1;do{for(y=x,x=null,w=null,b=0;y;){for(b++,v=y,_=0,f=0;f<P&&(_++,v=v.nextZ,v);f++);for(M=P;_>0||M>0&&v;)_!==0&&(M===0||!v||y.z<=v.z)?(g=y,y=y.nextZ,_--):(g=v,v=v.nextZ,M--),w?w.nextZ=g:x=g,g.prevZ=w,w=g;y=v}w.nextZ=null,P*=2}while(b>1)})(m)})(n,i,r,s);let o,l,c=n;for(;n.prev!==n.next;)if(o=n.prev,l=n.next,s?W0(n,i,r,s):V0(n))e.push(o.i/t|0),e.push(n.i/t|0),e.push(l.i/t|0),Fs(n),n=l.next,c=l.next;else if((n=l)===c){a?a===1?Ns(n=X0(ar(n),e,t),e,t,i,r,s,2):a===2&&Y0(n,e,t,i,r,s):Ns(ar(n),e,t,i,r,s,1);break}}function V0(n){let e=n.prev,t=n,i=n.next;if(St(e,t,i)>=0)return!1;let r=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=r<s?r<a?r:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,d=r>s?r>a?r:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c,m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=p&&kr(r,o,s,l,a,c,m.x,m.y)&&St(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function W0(n,e,t,i){let r=n.prev,s=n,a=n.next;if(St(r,s,a)>=0)return!1;let o=r.x,l=s.x,c=a.x,h=r.y,u=s.y,d=a.y,p=o<l?o<c?o:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,x=o>l?o>c?o:c:l>c?l:c,f=h>u?h>d?h:d:u>d?u:d,y=pc(p,m,e,t,i),v=pc(x,f,e,t,i),g=n.prevZ,w=n.nextZ;for(;g&&g.z>=y&&w&&w.z<=v;){if(g.x>=p&&g.x<=x&&g.y>=m&&g.y<=f&&g!==r&&g!==a&&kr(o,h,l,u,c,d,g.x,g.y)&&St(g.prev,g,g.next)>=0||(g=g.prevZ,w.x>=p&&w.x<=x&&w.y>=m&&w.y<=f&&w!==r&&w!==a&&kr(o,h,l,u,c,d,w.x,w.y)&&St(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;g&&g.z>=y;){if(g.x>=p&&g.x<=x&&g.y>=m&&g.y<=f&&g!==r&&g!==a&&kr(o,h,l,u,c,d,g.x,g.y)&&St(g.prev,g,g.next)>=0)return!1;g=g.prevZ}for(;w&&w.z<=v;){if(w.x>=p&&w.x<=x&&w.y>=m&&w.y<=f&&w!==r&&w!==a&&kr(o,h,l,u,c,d,w.x,w.y)&&St(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function X0(n,e,t){let i=n;do{let r=i.prev,s=i.next.next;!wo(r,s)&&xd(r,i,i.next,s)&&Os(r,s)&&Os(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),Fs(i),Fs(i.next),i=n=s),i=i.next}while(i!==n);return ar(i)}function Y0(n,e,t,i,r,s){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&K0(a,o)){let l=yd(a,o);return a=ar(a,a.next),l=ar(l,l.next),Ns(a,e,t,i,r,s,0),void Ns(l,e,t,i,r,s,0)}o=o.next}a=a.next}while(a!==n)}function j0(n,e){return n.x-e.x}function Z0(n,e){let t=(function(r,s){let a,o=s,l=-1/0,c=r.x,h=r.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let f=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(f<=c&&f>l&&(l=f,a=o.x<o.next.x?o:o.next,f===c))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,p=a.y,m,x=1/0;o=a;do c>=o.x&&o.x>=d&&c!==o.x&&kr(h<p?c:l,h,d,p,h<p?l:c,h,o.x,o.y)&&(m=Math.abs(h-o.y)/(c-o.x),Os(o,r)&&(m<x||m===x&&(o.x>a.x||o.x===a.x&&Q0(a,o)))&&(a=o,x=m)),o=o.next;while(o!==u);return a})(n,e);if(!t)return e;let i=yd(t,n);return ar(i,i.next),ar(t,t.next)}function Q0(n,e){return St(n.prev,n,e.prev)<0&&St(e.next,n,n.next)<0}function pc(n,e,t,i,r){return(n=1431655765&((n=858993459&((n=252645135&((n=16711935&((n=(n-t)*r|0)|n<<8))|n<<4))|n<<2))|n<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*r|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function q0(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function kr(n,e,t,i,r,s,a,o){return(r-a)*(e-o)>=(n-a)*(s-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(i-o)}function K0(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!(function(t,i){let r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==i.i&&r.next.i!==i.i&&xd(r,r.next,t,i))return!0;r=r.next}while(r!==t);return!1})(n,e)&&(Os(n,e)&&Os(e,n)&&(function(t,i){let r=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do r.y>o!=r.next.y>o&&r.next.y!==r.y&&a<(r.next.x-r.x)*(o-r.y)/(r.next.y-r.y)+r.x&&(s=!s),r=r.next;while(r!==t);return s})(n,e)&&(St(n.prev,n,e.prev)||St(n,e.prev,e))||wo(n,e)&&St(n.prev,n,n.next)>0&&St(e.prev,e,e.next)>0)}function St(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function wo(n,e){return n.x===e.x&&n.y===e.y}function xd(n,e,t,i){let r=Oa(St(n,e,t)),s=Oa(St(n,e,i)),a=Oa(St(t,i,n)),o=Oa(St(t,i,e));return r!==s&&a!==o||!(r!==0||!Na(n,t,e))||!(s!==0||!Na(n,i,e))||!(a!==0||!Na(t,n,i))||!(o!==0||!Na(t,e,i))}function Na(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Oa(n){return n>0?1:n<0?-1:0}function Os(n,e){return St(n.prev,n,n.next)<0?St(n,e,n.next)>=0&&St(n,n.prev,e)>=0:St(n,e,n.prev)<0||St(n,n.next,e)<0}function yd(n,e){let t=new fc(n.i,n.x,n.y),i=new fc(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Vu(n,e,t,i){let r=new fc(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Fs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function fc(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var Si=class n{static area(e){let t=e.length,i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return .5*i}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],r=[],s=[];Wu(e),Xu(i,e);let a=e.length;t.forEach(Wu);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,Xu(i,t[l]);let o=k0(i,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function Wu(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Xu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var mc=class n extends tt{constructor(e=new ui([new k(.5,.5),new k(-.5,.5),new k(-.5,-.5),new k(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,r=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,y=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:J0,g,w,b,_,M,P=!1;y&&(g=y.getSpacedPoints(h),P=!0,d=!1,w=y.computeFrenetFrames(h,!1),b=new E,_=new E,M=new E),d||(f=0,p=0,m=0,x=0);let R=o.extractPoints(c),I=R.shape,N=R.holes;if(!Si.isClockWise(I)){I=I.reverse();for(let F=0,H=N.length;F<H;F++){let W=N[F];Si.isClockWise(W)&&(N[F]=W.reverse())}}let C=Si.triangulateShape(I,N),z=I;for(let F=0,H=N.length;F<H;F++){let W=N[F];I=I.concat(W)}function O(F,H,W){return H||console.error("THREE.ExtrudeGeometry: vec does not exist"),F.clone().addScaledVector(H,W)}let q=I.length,le=C.length;function J(F,H,W){let re,ne,T,ae=F.x-H.x,Y=F.y-H.y,j=W.x-F.x,oe=W.y-F.y,pe=ae*ae+Y*Y,fe=ae*oe-Y*j;if(Math.abs(fe)>Number.EPSILON){let xe=Math.sqrt(pe),Re=Math.sqrt(j*j+oe*oe),ve=H.x-Y/xe,ye=H.y+ae/xe,Ue=((W.x-oe/Re-ve)*oe-(W.y+j/Re-ye)*j)/(ae*oe-Y*j);re=ve+ae*Ue-F.x,ne=ye+Y*Ue-F.y;let Rt=re*re+ne*ne;if(Rt<=2)return new k(re,ne);T=Math.sqrt(Rt/2)}else{let xe=!1;ae>Number.EPSILON?j>Number.EPSILON&&(xe=!0):ae<-Number.EPSILON?j<-Number.EPSILON&&(xe=!0):Math.sign(Y)===Math.sign(oe)&&(xe=!0),xe?(re=-Y,ne=ae,T=Math.sqrt(pe)):(re=ae,ne=Y,T=Math.sqrt(pe/2))}return new k(re/T,ne/T)}let Z=[];for(let F=0,H=z.length,W=H-1,re=F+1;F<H;F++,W++,re++)W===H&&(W=0),re===H&&(re=0),Z[F]=J(z[F],z[W],z[re]);let $=[],U,V=Z.concat();for(let F=0,H=N.length;F<H;F++){let W=N[F];U=[];for(let re=0,ne=W.length,T=ne-1,ae=re+1;re<ne;re++,T++,ae++)T===ne&&(T=0),ae===ne&&(ae=0),U[re]=J(W[re],W[T],W[ae]);$.push(U),V=V.concat(U)}for(let F=0;F<f;F++){let H=F/f,W=p*Math.cos(H*Math.PI/2),re=m*Math.sin(H*Math.PI/2)+x;for(let ne=0,T=z.length;ne<T;ne++){let ae=O(z[ne],Z[ne],re);S(ae.x,ae.y,-W)}for(let ne=0,T=N.length;ne<T;ne++){let ae=N[ne];U=$[ne];for(let Y=0,j=ae.length;Y<j;Y++){let oe=O(ae[Y],U[Y],re);S(oe.x,oe.y,-W)}}}let te=m+x;for(let F=0;F<q;F++){let H=d?O(I[F],V[F],te):I[F];P?(_.copy(w.normals[0]).multiplyScalar(H.x),b.copy(w.binormals[0]).multiplyScalar(H.y),M.copy(g[0]).add(_).add(b),S(M.x,M.y,M.z)):S(H.x,H.y,0)}for(let F=1;F<=h;F++)for(let H=0;H<q;H++){let W=d?O(I[H],V[H],te):I[H];P?(_.copy(w.normals[F]).multiplyScalar(W.x),b.copy(w.binormals[F]).multiplyScalar(W.y),M.copy(g[F]).add(_).add(b),S(M.x,M.y,M.z)):S(W.x,W.y,u/h*F)}for(let F=f-1;F>=0;F--){let H=F/f,W=p*Math.cos(H*Math.PI/2),re=m*Math.sin(H*Math.PI/2)+x;for(let ne=0,T=z.length;ne<T;ne++){let ae=O(z[ne],Z[ne],re);S(ae.x,ae.y,u+W)}for(let ne=0,T=N.length;ne<T;ne++){let ae=N[ne];U=$[ne];for(let Y=0,j=ae.length;Y<j;Y++){let oe=O(ae[Y],U[Y],re);P?S(oe.x,oe.y+g[h-1].y,g[h-1].x+W):S(oe.x,oe.y,u+W)}}}function A(F,H){let W=F.length;for(;--W>=0;){let re=W,ne=W-1;ne<0&&(ne=F.length-1);for(let T=0,ae=h+2*f;T<ae;T++){let Y=q*T,j=q*(T+1);ee(H+re+Y,H+ne+Y,H+ne+j,H+re+j)}}}function S(F,H,W){l.push(F),l.push(H),l.push(W)}function G(F,H,W){L(F),L(H),L(W);let re=r.length/3,ne=v.generateTopUV(i,r,re-3,re-2,re-1);Q(ne[0]),Q(ne[1]),Q(ne[2])}function ee(F,H,W,re){L(F),L(H),L(re),L(H),L(W),L(re);let ne=r.length/3,T=v.generateSideWallUV(i,r,ne-6,ne-3,ne-2,ne-1);Q(T[0]),Q(T[1]),Q(T[3]),Q(T[1]),Q(T[2]),Q(T[3])}function L(F){r.push(l[3*F+0]),r.push(l[3*F+1]),r.push(l[3*F+2])}function Q(F){s.push(F.x),s.push(F.y)}(function(){let F=r.length/3;if(d){let H=0,W=q*H;for(let re=0;re<le;re++){let ne=C[re];G(ne[2]+W,ne[1]+W,ne[0]+W)}H=h+2*f,W=q*H;for(let re=0;re<le;re++){let ne=C[re];G(ne[0]+W,ne[1]+W,ne[2]+W)}}else{for(let H=0;H<le;H++){let W=C[H];G(W[2],W[1],W[0])}for(let H=0;H<le;H++){let W=C[H];G(W[0]+q*h,W[1]+q*h,W[2]+q*h)}}i.addGroup(F,r.length/3-F,0)})(),(function(){let F=r.length/3,H=0;A(z,H),H+=z.length;for(let W=0,re=N.length;W<re;W++){let ne=N[W];A(ne,H),H+=ne.length}i.addGroup(F,r.length/3-F,1)})()}this.setAttribute("position",new _e(r,3)),this.setAttribute("uv",new _e(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,i,r){if(r.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];r.shapes.push(o.uuid)}else r.shapes.push(t.uuid);return r.options=Object.assign({},i),i.extrudePath!==void 0&&(r.options.extrudePath=i.extrudePath.toJSON()),r})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new fo[r.type]().fromJSON(r)),new n(i,e.options)}},J0={generateTopUV:function(n,e,t,i,r){let s=e[3*t],a=e[3*t+1],o=e[3*i],l=e[3*i+1],c=e[3*r],h=e[3*r+1];return[new k(s,a),new k(o,l),new k(c,h)]},generateSideWallUV:function(n,e,t,i,r,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*i],h=e[3*i+1],u=e[3*i+2],d=e[3*r],p=e[3*r+1],m=e[3*r+2],x=e[3*s],f=e[3*s+1],y=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new k(a,1-l),new k(c,1-u),new k(d,1-m),new k(x,1-y)]:[new k(o,1-l),new k(h,1-u),new k(p,1-m),new k(f,1-y)]}},rt=class n extends rr{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},gc=class n extends rr{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},vc=class n extends tt{constructor(e=.5,t=1,i=32,r=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/(r=Math.max(1,r)),p=new E,m=new k;for(let x=0;x<=r;x++){for(let f=0;f<=i;f++){let y=s+f/i*a;p.x=u*Math.cos(y),p.y=u*Math.sin(y),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let x=0;x<r;x++){let f=x*(i+1);for(let y=0;y<i;y++){let v=y+f,g=v,w=v+i+1,b=v+i+2,_=v+1;o.push(g,w,_),o.push(w,b,_)}}this.setIndex(o),this.setAttribute("position",new _e(l,3)),this.setAttribute("normal",new _e(c,3)),this.setAttribute("uv",new _e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ri=class n extends tt{constructor(e=new ui([new k(0,.5),new k(-.5,-.5),new k(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],r=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let u=r.length/3,d=h.extractPoints(t),p=d.shape,m=d.holes;Si.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,y=m.length;f<y;f++){let v=m[f];Si.isClockWise(v)===!0&&(m[f]=v.reverse())}let x=Si.triangulateShape(p,m);for(let f=0,y=m.length;f<y;f++){let v=m[f];p=p.concat(v)}for(let f=0,y=p.length;f<y;f++){let v=p[f];r.push(v.x,v.y,0),s.push(0,0,1),a.push(v.x,v.y)}for(let f=0,y=x.length;f<y;f++){let v=x[f],g=v[0]+u,w=v[1]+u,b=v[2]+u;i.push(g,w,b),l+=3}}this.setIndex(i),this.setAttribute("position",new _e(r,3)),this.setAttribute("normal",new _e(s,3)),this.setAttribute("uv",new _e(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,i){if(i.shapes=[],Array.isArray(t))for(let r=0,s=t.length;r<s;r++){let a=t[r];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i})(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let r=0,s=e.shapes.length;r<s;r++){let a=t[e.shapes[r]];i.push(a)}return new n(i,e.curveSegments)}},Rn=class n extends tt{constructor(e=1,t=32,i=16,r=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new E,d=new E,p=[],m=[],x=[],f=[];for(let y=0;y<=i;y++){let v=[],g=y/i,w=0;y===0&&a===0?w=.5/t:y===i&&l===Math.PI&&(w=-.5/t);for(let b=0;b<=t;b++){let _=b/t;u.x=-e*Math.cos(r+_*s)*Math.sin(a+g*o),u.y=e*Math.cos(a+g*o),u.z=e*Math.sin(r+_*s)*Math.sin(a+g*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),f.push(_+w,1-g),v.push(c++)}h.push(v)}for(let y=0;y<i;y++)for(let v=0;v<t;v++){let g=h[y][v+1],w=h[y][v],b=h[y+1][v],_=h[y+1][v+1];(y!==0||a>0)&&p.push(g,w,_),(y!==i-1||l<Math.PI)&&p.push(w,b,_)}this.setIndex(p),this.setAttribute("position",new _e(m,3)),this.setAttribute("normal",new _e(x,3)),this.setAttribute("uv",new _e(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},xc=class n extends rr{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},Yt=class n extends tt{constructor(e=1,t=.4,i=12,r=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);let a=[],o=[],l=[],c=[],h=new E,u=new E,d=new E;for(let p=0;p<=i;p++)for(let m=0;m<=r;m++){let x=m/r*s,f=p/i*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(x),u.y=(e+t*Math.cos(f))*Math.sin(x),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/r),c.push(p/i)}for(let p=1;p<=i;p++)for(let m=1;m<=r;m++){let x=(r+1)*p+m-1,f=(r+1)*(p-1)+m-1,y=(r+1)*(p-1)+m,v=(r+1)*p+m;a.push(x,f,v),a.push(f,y,v)}this.setIndex(a),this.setAttribute("position",new _e(o,3)),this.setAttribute("normal",new _e(l,3)),this.setAttribute("uv",new _e(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},yc=class n extends tt{constructor(e=1,t=.4,i=64,r=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:r,p:s,q:a},i=Math.floor(i),r=Math.floor(r);let o=[],l=[],c=[],h=[],u=new E,d=new E,p=new E,m=new E,x=new E,f=new E,y=new E;for(let g=0;g<=i;++g){let w=g/i*s*Math.PI*2;v(w,s,a,e,p),v(w+.01,s,a,e,m),f.subVectors(m,p),y.addVectors(m,p),x.crossVectors(f,y),y.crossVectors(x,f),x.normalize(),y.normalize();for(let b=0;b<=r;++b){let _=b/r*Math.PI*2,M=-t*Math.cos(_),P=t*Math.sin(_);u.x=p.x+(M*y.x+P*x.x),u.y=p.y+(M*y.y+P*x.y),u.z=p.z+(M*y.z+P*x.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),c.push(d.x,d.y,d.z),h.push(g/i),h.push(b/r)}}for(let g=1;g<=i;g++)for(let w=1;w<=r;w++){let b=(r+1)*(g-1)+(w-1),_=(r+1)*g+(w-1),M=(r+1)*g+w,P=(r+1)*(g-1)+w;o.push(b,_,P),o.push(_,M,P)}function v(g,w,b,_,M){let P=Math.cos(g),R=Math.sin(g),I=b/w*g,N=Math.cos(I);M.x=_*(2+N)*.5*P,M.y=_*(2+N)*R*.5,M.z=_*Math.sin(I)*.5}this.setIndex(o),this.setAttribute("position",new _e(l,3)),this.setAttribute("normal",new _e(c,3)),this.setAttribute("uv",new _e(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},or=class n extends tt{constructor(e=new uo(new E(-1,-1,0),new E(-1,1,0),new E(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new E,l=new E,c=new k,h=new E,u=[],d=[],p=[],m=[];function x(f){h=e.getPointAt(f/t,h);let y=a.normals[f],v=a.binormals[f];for(let g=0;g<=r;g++){let w=g/r*Math.PI*2,b=Math.sin(w),_=-Math.cos(w);l.x=_*y.x+b*v.x,l.y=_*y.y+b*v.y,l.z=_*y.z+b*v.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)x(f);x(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let y=0;y<=r;y++)c.x=f/t,c.y=y/r,p.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let y=1;y<=r;y++){let v=(r+1)*(f-1)+(y-1),g=(r+1)*f+(y-1),w=(r+1)*f+y,b=(r+1)*(f-1)+y;m.push(v,g,b),m.push(g,w,b)}})()})(),this.setIndex(m),this.setAttribute("position",new _e(u,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new fo[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Ec=class extends tt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,r=new E,s=new E;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let p=d,m=d+u.count;p<m;p+=3)for(let x=0;x<3;x++){let f=o.getX(p+x),y=o.getX(p+(x+1)%3);r.fromBufferAttribute(a,f),s.fromBufferAttribute(a,y),Yu(r,s,i)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,u=3*o+(c+1)%3;r.fromBufferAttribute(a,h),s.fromBufferAttribute(a,u),Yu(r,s,i)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new _e(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Yu(n,e,t){let i=`${n.x},${n.y},${n.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${n.x},${n.y},${n.z}`;return t.has(i)!==!0&&t.has(r)!==!0&&(t.add(i),t.add(r),!0)}var N1=Object.freeze({__proto__:null,BoxGeometry:we,CapsuleGeometry:hc,CircleGeometry:uc,ConeGeometry:yt,CylinderGeometry:nt,DodecahedronGeometry:sr,EdgesGeometry:dc,ExtrudeGeometry:mc,IcosahedronGeometry:rt,LatheGeometry:mo,OctahedronGeometry:gc,PlaneGeometry:hi,PolyhedronGeometry:rr,RingGeometry:vc,ShapeGeometry:Ri,SphereGeometry:Rn,TetrahedronGeometry:xc,TorusGeometry:Yt,TorusKnotGeometry:yc,TubeGeometry:or,WireframeGeometry:Ec});var lr=class extends wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new k(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Fa(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function $0(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var $r=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];t:{e:{let a;n:{i:if(!(e<r)){for(let o=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=r,r=t[++i],e<r)break e}a=t.length;break n}if(e>=s)break t;{let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}a=i,i=0}}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Mc=class extends $r{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qh,endingEnd:Qh}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case qh:s=e,o=2*t-i;break;case Kh:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case qh:a=e,l=2*i-t;break;case Kh:a=1,l=i+r[1]-r[0];break;default:a=e-1,l=t}let c=.5*(i-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,m=(i-t)/(r-t),x=m*m,f=x*m,y=-d*f+2*d*x-d*m,v=(1+d)*f+(-1.5-2*d)*x+(-.5+d)*m+1,g=(-1-p)*f+(1.5+p)*x+.5*m,w=p*f-p*x;for(let b=0;b!==o;++b)s[b]=y*a[h+b]+v*a[c+b]+g*a[l+b]+w*a[u+b];return s}},wc=class extends $r{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(r-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}},Ac=class extends $r{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},On=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Fa(t,this.TimeBufferType),this.values=Fa(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Fa(e.times,Array),values:Fa(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Ac(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Mc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ha:t=this.InterpolantFactoryMethodDiscrete;break;case za:t=this.InterpolantFactoryMethodLinear;break;case rl:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ha;case this.InterpolantFactoryMethodLinear:return za;case this.InterpolantFactoryMethodSmooth:return rl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e}return this}trim(e,t){let i=this.times,r=i.length,s=0,a=r-1;for(;s!==r&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&$0(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===rl,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(r)l=!0;else{let h=o*i,u=h-i,d=h+i;for(let p=0;p!==i;++p){let m=t[h+p];if(m!==t[u+p]||m!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,u=a*i;for(let d=0;d!==i;++d)t[u+d]=t[h+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};On.prototype.TimeBufferType=Float32Array,On.prototype.ValueBufferType=Float32Array,On.prototype.DefaultInterpolation=za;var Ki=class extends On{};Ki.prototype.ValueTypeName="bool",Ki.prototype.ValueBufferType=Array,Ki.prototype.DefaultInterpolation=Ha,Ki.prototype.InterpolantFactoryMethodLinear=void 0,Ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Sc=class extends On{};Sc.prototype.ValueTypeName="color";var _c=class extends On{};_c.prototype.ValueTypeName="number";var Tc=class extends $r{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(r-t),c=e*o;for(let h=c+o;c!==h;c+=4)en.slerpFlat(s,0,a,c-o,a,c,l);return s}},bs=class extends On{InterpolantFactoryMethodLinear(e){return new Tc(this.times,this.values,this.getValueSize(),e)}};bs.prototype.ValueTypeName="quaternion",bs.prototype.DefaultInterpolation=za,bs.prototype.InterpolantFactoryMethodSmooth=void 0;var Ji=class extends On{};Ji.prototype.ValueTypeName="string",Ji.prototype.ValueBufferType=Array,Ji.prototype.DefaultInterpolation=Ha,Ji.prototype.InterpolantFactoryMethodLinear=void 0,Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var bc=class extends On{};bc.prototype.ValueTypeName="vector";var Di=class{constructor(e,t,i){let r=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){l++,a===!1&&r.onStart!==void 0&&r.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,l),o===l&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return m}return null}}},em=new Di,es=class{constructor(e){this.manager=e!==void 0?e:em,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise((function(r,s){i.load(e,r,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};es.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hs=class extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},go=class extends Hs{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Il=new Ne,ju=new E,Zu=new E,vo=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new k(512,512),this.map=null,this.mapPass=null,this.matrix=new Ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kr,this._frameExtents=new k(1,1),this._viewportCount=1,this._viewports=[new et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;ju.setFromMatrixPosition(e.matrixWorld),t.position.copy(ju),Zu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zu),t.updateMatrixWorld(),Il.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Il),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Il)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Qu=new Ne,Ms=new E,Ll=new E,Cc=class extends vo{constructor(){super(new At(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new k(4,2),this._viewportCount=6,this._viewports=[new et(2,1,1,1),new et(0,1,1,1),new et(3,1,1,1),new et(1,1,1,1),new et(3,0,1,1),new et(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Ms.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ms),Ll.copy(i.position),Ll.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ll),i.updateMatrixWorld(),r.makeTranslation(-Ms.x,-Ms.y,-Ms.z),Qu.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qu)}},zs=class extends Hs{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new Cc}get power(){return 4*this.intensity*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Rc=class extends vo{constructor(){super(new to(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},cr=class extends Hs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.shadow=new Rc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var O1=new Ne,F1=new Ne,H1=new Ne;var xo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=qu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=qu();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function qu(){return(typeof performance>"u"?Date:performance).now()}var z1=new E,G1=new en,k1=new E,V1=new E;var W1=new E,X1=new en,Y1=new E,j1=new E;var Oc="\\[\\]\\.:\\/",tm=new RegExp("["+Oc+"]","g"),Bl="[^"+Oc+"]",nm="[^"+Oc.replace("\\.","")+"]",im=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Bl)+/(WCOD+)?/.source.replace("WCOD",nm)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bl)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bl)+"$"),rm=["material","materials","bones","map"],xt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(tm,"")}static parseTrackName(e){let t=im.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);rm.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[r];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xt.Composite=class{constructor(n,e,t){let i=t||xt.parseTrackName(e);this._targetGroup=n,this._bindings=n.subscribe_(e,i)}getValue(n,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(n,e)}setValue(n,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=t.length;i!==r;++i)t[i].setValue(n,e)}bind(){let n=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=n.length;e!==t;++e)n[e].bind()}unbind(){let n=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=n.length;e!==t;++e)n[e].unbind()}},xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},xt.prototype.GetterByBindingType=[xt.prototype._getValue_direct,xt.prototype._getValue_array,xt.prototype._getValue_arrayElement,xt.prototype._getValue_toArray],xt.prototype.SetterByBindingTypeAndVersioning=[[xt.prototype._setValue_direct,xt.prototype._setValue_direct_setNeedsUpdate,xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_array,xt.prototype._setValue_array_setNeedsUpdate,xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_arrayElement,xt.prototype._setValue_arrayElement_setNeedsUpdate,xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_fromArray,xt.prototype._setValue_fromArray_setNeedsUpdate,xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Z1=new Float32Array(1);var ue=class n{constructor(e){this.value=e}clone(){return new n(this.value.clone===void 0?this.value:this.value.clone())}};var Gs=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Bt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Q1=new k;var q1=new E,K1=new E;var J1=new E;var $1=new E,ex=new Ne,tx=new Ne;var nx=new E,ix=new he,rx=new he;var sx=new E,ax=new E,ox=new E;var lx=new E,cx=new nr;var hx=new Zn;var ux=new E;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var Md={type:"change"},Fc={type:"start"},wd={type:"end"},Ao=new Ti,Ad=new Nn,sm=Math.cos(70*Fn.DEG2RAD),So=class extends $t{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new E,this.cursor=new E,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:hr.ROTATE,MIDDLE:hr.DOLLY,RIGHT:hr.PAN},this.touches={ONE:ur.ROTATE,TWO:ur.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(B){B.addEventListener("keydown",ye),this._domElementKeyEvents=B},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ye),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(Md),i.update(),s=r.NONE},this.update=(function(){let B=new E,ge=new en().setFromUnitVectors(e.up,new E(0,1,0)),Le=ge.clone().invert(),Ke=new E,X=new en,yn=new E,Ft=2*Math.PI;return function(ta=null){let hs=i.object.position;B.copy(hs).sub(i.target),B.applyQuaternion(ge),o.setFromVector3(B),i.autoRotate&&s===r.NONE&&N(R(ta)),i.enableDamping?(o.theta+=l.theta*i.dampingFactor,o.phi+=l.phi*i.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let An=i.minAzimuthAngle,Sn=i.maxAzimuthAngle;isFinite(An)&&isFinite(Sn)&&(An<-Math.PI?An+=Ft:An>Math.PI&&(An-=Ft),Sn<-Math.PI?Sn+=Ft:Sn>Math.PI&&(Sn-=Ft),An<=Sn?o.theta=Math.max(An,Math.min(Sn,o.theta)):o.theta=o.theta>(An+Sn)/2?Math.max(An,o.theta):Math.min(Sn,o.theta)),o.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,o.phi)),o.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&_||i.object.isOrthographicCamera?o.radius=$(o.radius):o.radius=$(o.radius*c),B.setFromSpherical(o),B.applyQuaternion(Le),hs.copy(i.target).add(B),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let Mr=!1;if(i.zoomToCursor&&_){let ti=null;if(i.object.isPerspectiveCamera){let gi=B.length();ti=$(gi*c);let zi=gi-ti;i.object.position.addScaledVector(w,zi),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){let gi=new E(b.x,b.y,0);gi.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Mr=!0;let zi=new E(b.x,b.y,0);zi.unproject(i.object),i.object.position.sub(zi).add(gi),i.object.updateMatrixWorld(),ti=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;ti!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(ti).add(i.object.position):(Ao.origin.copy(i.object.position),Ao.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Ao.direction))<sm?e.lookAt(i.target):(Ad.setFromNormalAndCoplanarPoint(i.object.up,i.target),Ao.intersectPlane(Ad,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Mr=!0);return c=1,_=!1,Mr||Ke.distanceToSquared(i.object.position)>a||8*(1-X.dot(i.object.quaternion))>a||yn.distanceToSquared(i.target)>0?(i.dispatchEvent(Md),Ke.copy(i.object.position),X.copy(i.object.quaternion),yn.copy(i.target),!0):!1}})(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",Se),i.domElement.removeEventListener("pointerdown",oe),i.domElement.removeEventListener("pointercancel",fe),i.domElement.removeEventListener("wheel",ve),i.domElement.removeEventListener("pointermove",pe),i.domElement.removeEventListener("pointerup",fe),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",ye),i._domElementKeyEvents=null)};let i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},s=r.NONE,a=1e-6,o=new Gs,l=new Gs,c=1,h=new E,u=new k,d=new k,p=new k,m=new k,x=new k,f=new k,y=new k,v=new k,g=new k,w=new E,b=new k,_=!1,M=[],P={};function R(B){return B!==null?2*Math.PI/60*i.autoRotateSpeed*B:2*Math.PI/60/60*i.autoRotateSpeed}function I(B){let ge=Math.abs(B)/(100*(window.devicePixelRatio|0));return Math.pow(.95,i.zoomSpeed*ge)}function N(B){l.theta-=B}function C(B){l.phi-=B}let z=(function(){let B=new E;return function(Le,Ke){B.setFromMatrixColumn(Ke,0),B.multiplyScalar(-Le),h.add(B)}})(),O=(function(){let B=new E;return function(Le,Ke){i.screenSpacePanning===!0?B.setFromMatrixColumn(Ke,1):(B.setFromMatrixColumn(Ke,0),B.crossVectors(i.object.up,B)),B.multiplyScalar(Le),h.add(B)}})(),q=(function(){let B=new E;return function(Le,Ke){let X=i.domElement;if(i.object.isPerspectiveCamera){let yn=i.object.position;B.copy(yn).sub(i.target);let Ft=B.length();Ft*=Math.tan(i.object.fov/2*Math.PI/180),z(2*Le*Ft/X.clientHeight,i.object.matrix),O(2*Ke*Ft/X.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(z(Le*(i.object.right-i.object.left)/i.object.zoom/X.clientWidth,i.object.matrix),O(Ke*(i.object.top-i.object.bottom)/i.object.zoom/X.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}})();function le(B){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function J(B){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function Z(B,ge){if(!i.zoomToCursor)return;_=!0;let Le=i.domElement.getBoundingClientRect(),Ke=B-Le.left,X=ge-Le.top,yn=Le.width,Ft=Le.height;b.x=Ke/yn*2-1,b.y=-(X/Ft)*2+1,w.set(b.x,b.y,1).unproject(i.object).sub(i.object.position).normalize()}function $(B){return Math.max(i.minDistance,Math.min(i.maxDistance,B))}function U(B){u.set(B.clientX,B.clientY)}function V(B){Z(B.clientX,B.clientX),y.set(B.clientX,B.clientY)}function te(B){m.set(B.clientX,B.clientY)}function A(B){d.set(B.clientX,B.clientY),p.subVectors(d,u).multiplyScalar(i.rotateSpeed);let ge=i.domElement;N(2*Math.PI*p.x/ge.clientHeight),C(2*Math.PI*p.y/ge.clientHeight),u.copy(d),i.update()}function S(B){v.set(B.clientX,B.clientY),g.subVectors(v,y),g.y>0?le(I(g.y)):g.y<0&&J(I(g.y)),y.copy(v),i.update()}function G(B){x.set(B.clientX,B.clientY),f.subVectors(x,m).multiplyScalar(i.panSpeed),q(f.x,f.y),m.copy(x),i.update()}function ee(B){Z(B.clientX,B.clientY),B.deltaY<0?J(I(B.deltaY)):B.deltaY>0&&le(I(B.deltaY)),i.update()}function L(B){let ge=!1;switch(B.code){case i.keys.UP:B.ctrlKey||B.metaKey||B.shiftKey?C(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):q(0,i.keyPanSpeed),ge=!0;break;case i.keys.BOTTOM:B.ctrlKey||B.metaKey||B.shiftKey?C(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):q(0,-i.keyPanSpeed),ge=!0;break;case i.keys.LEFT:B.ctrlKey||B.metaKey||B.shiftKey?N(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):q(i.keyPanSpeed,0),ge=!0;break;case i.keys.RIGHT:B.ctrlKey||B.metaKey||B.shiftKey?N(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):q(-i.keyPanSpeed,0),ge=!0;break}ge&&(B.preventDefault(),i.update())}function Q(B){if(M.length===1)u.set(B.pageX,B.pageY);else{let ge=xn(B),Le=.5*(B.pageX+ge.x),Ke=.5*(B.pageY+ge.y);u.set(Le,Ke)}}function F(B){if(M.length===1)m.set(B.pageX,B.pageY);else{let ge=xn(B),Le=.5*(B.pageX+ge.x),Ke=.5*(B.pageY+ge.y);m.set(Le,Ke)}}function H(B){let ge=xn(B),Le=B.pageX-ge.x,Ke=B.pageY-ge.y,X=Math.sqrt(Le*Le+Ke*Ke);y.set(0,X)}function W(B){i.enableZoom&&H(B),i.enablePan&&F(B)}function re(B){i.enableZoom&&H(B),i.enableRotate&&Q(B)}function ne(B){if(M.length==1)d.set(B.pageX,B.pageY);else{let Le=xn(B),Ke=.5*(B.pageX+Le.x),X=.5*(B.pageY+Le.y);d.set(Ke,X)}p.subVectors(d,u).multiplyScalar(i.rotateSpeed);let ge=i.domElement;N(2*Math.PI*p.x/ge.clientHeight),C(2*Math.PI*p.y/ge.clientHeight),u.copy(d)}function T(B){if(M.length===1)x.set(B.pageX,B.pageY);else{let ge=xn(B),Le=.5*(B.pageX+ge.x),Ke=.5*(B.pageY+ge.y);x.set(Le,Ke)}f.subVectors(x,m).multiplyScalar(i.panSpeed),q(f.x,f.y),m.copy(x)}function ae(B){let ge=xn(B),Le=B.pageX-ge.x,Ke=B.pageY-ge.y,X=Math.sqrt(Le*Le+Ke*Ke);v.set(0,X),g.set(0,Math.pow(v.y/y.y,i.zoomSpeed)),le(g.y),y.copy(v);let yn=(B.pageX+ge.x)*.5,Ft=(B.pageY+ge.y)*.5;Z(yn,Ft)}function Y(B){i.enableZoom&&ae(B),i.enablePan&&T(B)}function j(B){i.enableZoom&&ae(B),i.enableRotate&&ne(B)}function oe(B){i.enabled!==!1&&(M.length===0&&(i.domElement.setPointerCapture(B.pointerId),i.domElement.addEventListener("pointermove",pe),i.domElement.addEventListener("pointerup",fe)),Ye(B),B.pointerType==="touch"?Ue(B):xe(B))}function pe(B){i.enabled!==!1&&(B.pointerType==="touch"?Rt(B):Re(B))}function fe(B){Ge(B),M.length===0&&(i.domElement.releasePointerCapture(B.pointerId),i.domElement.removeEventListener("pointermove",pe),i.domElement.removeEventListener("pointerup",fe)),i.dispatchEvent(wd),s=r.NONE}function xe(B){let ge;switch(B.button){case 0:ge=i.mouseButtons.LEFT;break;case 1:ge=i.mouseButtons.MIDDLE;break;case 2:ge=i.mouseButtons.RIGHT;break;default:ge=-1}switch(ge){case hr.DOLLY:if(i.enableZoom===!1)return;V(B),s=r.DOLLY;break;case hr.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(i.enablePan===!1)return;te(B),s=r.PAN}else{if(i.enableRotate===!1)return;U(B),s=r.ROTATE}break;case hr.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(i.enableRotate===!1)return;U(B),s=r.ROTATE}else{if(i.enablePan===!1)return;te(B),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Fc)}function Re(B){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;A(B);break;case r.DOLLY:if(i.enableZoom===!1)return;S(B);break;case r.PAN:if(i.enablePan===!1)return;G(B);break}}function ve(B){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(B.preventDefault(),i.dispatchEvent(Fc),ee(B),i.dispatchEvent(wd))}function ye(B){i.enabled===!1||i.enablePan===!1||L(B)}function Ue(B){switch(Hi(B),M.length){case 1:switch(i.touches.ONE){case ur.ROTATE:if(i.enableRotate===!1)return;Q(B),s=r.TOUCH_ROTATE;break;case ur.PAN:if(i.enablePan===!1)return;F(B),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case ur.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;W(B),s=r.TOUCH_DOLLY_PAN;break;case ur.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;re(B),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Fc)}function Rt(B){switch(Hi(B),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;ne(B),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;T(B),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Y(B),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;j(B),i.update();break;default:s=r.NONE}}function Se(B){i.enabled!==!1&&B.preventDefault()}function Ye(B){M.push(B.pointerId)}function Ge(B){delete P[B.pointerId];for(let ge=0;ge<M.length;ge++)if(M[ge]==B.pointerId){M.splice(ge,1);return}}function Hi(B){let ge=P[B.pointerId];ge===void 0&&(ge=new k,P[B.pointerId]=ge),ge.set(B.pageX,B.pageY)}function xn(B){let ge=B.pointerId===M[0]?M[1]:M[0];return P[ge]}i.domElement.addEventListener("contextmenu",Se),i.domElement.addEventListener("pointerdown",oe),i.domElement.addEventListener("pointercancel",fe),i.domElement.addEventListener("wheel",ve,{passive:!1}),this.update()}};var fr=Math.PI*2,Sd=new E(0,-1,0),Ii=[1,.94,1.04],Td=new lr({vertexColors:!0,flatShading:!0,roughness:.9,metalness:0,emissive:new he(2759216),emissiveIntensity:.14}),bd=Td.clone();bd.side=jt;var Hc=new Map,zc=new Map;function am(n){return n instanceof he?`#${n.getHexString()}`:n}function mn(n,e,t=0){let i=new he(n);return i.offsetHSL(0,t,e),`#${i.getHexString()}`}function ze(n,e,t={}){let i=`${am(e)}|${t.basic?"b":"s"}`,r;t.basic?(zc.has(i)||zc.set(i,new Xt({color:new he(e),toneMapped:!1})),r=zc.get(i)):(Hc.has(i)||Hc.set(i,new lr({color:new he(e),flatShading:!0,roughness:.9,metalness:0,emissive:new he(2364970),emissiveIntensity:.1})),r=Hc.get(i));let s=new Je(n,r);return s.castShadow=t.cast??!1,s.receiveShadow=t.receive??!1,s}var ct=class{constructor(){this.position=[],this.color=[]}tri(e,t,i,r,s=1){let a=new he(r).multiplyScalar(s);for(let o of[e,t,i])this.position.push(o.x,o.y,o.z),this.color.push(a.r,a.g,a.b)}quad(e,t,i,r,s,a=1){this.tri(e,t,i,s,a),this.tri(e,i,r,s,a)}splitQuad(e,t,i,r,s,a,o=1,l=1){this.tri(e,t,i,s,o),this.tri(e,i,r,a,l)}box(e,t,i,r=1,s){let a=t.x*.5,o=t.y*.5,l=t.z*.5,c=[new E(-a,-o,-l),new E(a,-o,-l),new E(a,o,-l),new E(-a,o,-l),new E(-a,-o,l),new E(a,-o,l),new E(a,o,l),new E(-a,o,l)];if(s){let u=s instanceof en?s:new en().setFromEuler(s);c.forEach(d=>d.applyQuaternion(u))}c.forEach(u=>u.add(e));let h=[[0,1,2,3],[5,4,7,6],[4,5,1,0],[3,2,6,7],[4,0,3,7],[1,5,6,2]];for(let[u,d,p,m]of h)this.quad(c[u],c[d],c[p],c[m],i,r)}build(){let e=new tt;return e.setAttribute("position",new _e(this.position,3)),e.setAttribute("color",new _e(this.color,3)),e.computeVertexNormals(),e}};function mt(n,e={}){let t=new Je(n.build(),e.doubleSide?bd:Td);return t.castShadow=e.cast??!0,t.receiveShadow=e.receive??!0,t}function Pi(n,e,t,i,r=0){let s=n[e],a=fr*(t%i)/i,o=r*Math.sin(t*2.37+e*1.76),l=s.y+(e>0&&e<n.length-1?r*Math.sin(t*1.7+e*3.1):0);return new E(Math.sin(a)*(s.rx+o),l,Math.cos(a)*(s.rz+o*.7)+(s.z||0))}function Cd(n){let e=Math.sin(n*12.9898+4.1414)*43758.5453;return e-Math.floor(e)}function mr(n,e,t,i,r={}){let s=!!r.pattern,a=r.coat||i.coat,o=r.accent||i.accent,l=r.fold??.008;for(let c=0;c<e.length-1;c++)for(let h=0;h<t;h++){let u=Pi(e,c,h,t,l),d=Pi(e,c,h+1,t,l),p=Pi(e,c+1,h+1,t,l),m=Pi(e,c+1,h,t,l),x=Ii[(c*7+h*3)%3],f=Ii[(c*7+h*3+1)%3],y=s&&Cd(c*31+h*17+5)<.5;n.tri(u,d,p,y?o:a,x),n.tri(u,p,m,y?a:o,f)}}function Gc(n,e,t,i,r,s,a,o,l,c,h={}){let u=h.z0||0,d=h.cols||5,p=3,m=[[1,1,1,1,0],[1,0,0,1,0],[1,1,0,1,1]];Hn(n,[{y:t,rx:r,rz:s,z:u},{y:i,rx:a,rz:o,z:u}],e,l,{tone:1});let f=h.lift??1.006,y=(g,w,b)=>{let _=fr*(g+w/d)/e,M=(r+(a-r)*b)*f,P=(s+(o-s)*b)*f;return new E(Math.sin(_)*M,t+(i-t)*b,Math.cos(_)*P+u)};for(let g=0;g<e;g++)for(let w=0;w<p;w++)for(let b=0;b<d;b++){if(!m[w][b])continue;let _=w/p,M=(w+1)/p,P=y(g,b,_),R=y(g,b+1,_),I=y(g,b+1,M),N=y(g,b,M);n.quad(P,R,I,N,c,1)}let v=g=>{let w=[{y:g-.002,rx:r*f,rz:s*f,z:u},{y:g+.002,rx:r*f,rz:s*f,z:u}];Hn(n,w,e,c,{tone:1})};v(t),v(i)}function om(n,e=2){let t=[];for(let i=0;i<n.length-1;i++){let r=n[i],s=n[i+1];for(let a=0;a<e;a++){let o=a/e;t.push({y:r.y+(s.y-r.y)*o,rx:r.rx+(s.rx-r.rx)*o,rz:r.rz+(s.rz-r.rz)*o,z:(r.z||0)+((s.z||0)-(r.z||0))*o})}}return t.push(n[n.length-1]),t}function Hn(n,e,t,i,r={}){let s=r.tone??1,a=r.fold??0;for(let o=0;o<e.length-1;o++)for(let l=0;l<t;l++){let c=Pi(e,o,l,t,a),h=Pi(e,o,l+1,t,a),u=Pi(e,o+1,l+1,t,a),d=Pi(e,o+1,l,t,a);n.quad(c,h,u,d,i,s*Ii[(o+l)%3])}}function pr(n,e,t,i,r,s,a=1){let o=[{y:t,rx:e,rz:e*.9},{y:t+i,rx:e,rz:e*.9}];Hn(n,o,r,s,{tone:a})}function dr(n,e,t,i=.006){let r=n[0],s=n[n.length-1];for(let u=0;u<n.length-1;u++)if(t>=n[u].y&&t<=n[u+1].y){r=n[u],s=n[u+1];break}let a=s.y===r.y?0:(t-r.y)/(s.y-r.y),o=r.rx+(s.rx-r.rx)*a,l=r.rz+(s.rz-r.rz)*a,h=(r.z||0)+l*Math.sqrt(Math.max(0,1-Math.min(1,(e/Math.max(1e-4,o))**2)));return new E(e,t,h+i)}function lm(n,e,t){let i=t.coat,r=t.trim,s=t.accent,a=[new k(-.06,.455),new k(0,.36),new k(.055,.265),new k(.108,.16)],o=.072;for(let l=0;l<a.length-1;l++){let c=a[l],h=a[l+1],u=new k(h.x-c.x,h.y-c.y).normalize(),d=new k(-u.y,u.x).multiplyScalar(o*.5),m=[new k(c.x+d.x,c.y+d.y),new k(h.x+d.x,h.y+d.y),new k(h.x-d.x,h.y-d.y),new k(c.x-d.x,c.y-d.y)].map(x=>dr(e,x.x,x.y,.006));n.quad(m[0],m[1],m[2],m[3],i,1.04)}for(let l=0;l<a.length-1;l++){let c=a[l],h=a[l+1],u=new k(h.x-c.x,h.y-c.y).normalize(),d=new k(-u.y,u.x).multiplyScalar(o*.54),p=[c,h].map(x=>dr(e,x.x+d.x,x.y+d.y,.009)),m=[h,c].map(x=>dr(e,x.x+d.x*.88,x.y+d.y*.88,.009));n.quad(p[0],p[1],m[1],m[0],r,1)}for(let l of[.335,.275])for(let c=0;c<3;c++){let h=.005+c*.017,u=dr(e,h,l,.01),d=dr(e,h+.009,l+.006,.01),p=dr(e,h+.009,l+.02,.01),m=dr(e,h,l+.014,.01);n.quad(u,d,p,m,r,1)}}function cm(n,e){let t=[{y:0,rx:.176,rz:.13},{y:.06,rx:.184,rz:.137},{y:.15,rx:.166,rz:.128},{y:.24,rx:.192,rz:.143},{y:.36,rx:.22,rz:.16},{y:.47,rx:.226,rz:.166},{y:.52,rx:.158,rz:.122},{y:.56,rx:.094,rz:.086}],i=new ct;mr(i,t,16,e,{pattern:!!e.pattern,fold:.006}),lm(i,t,e),n.add(mt(i,{cast:!0,receive:!0}));for(let u of[-1,1]){let d=ze(new rt(.06,0),e.coat,{cast:!0});d.scale.set(1,.72,.9),d.position.set(u*.21,.465,0),n.add(d)}let r=new ct;pr(r,.182,.01,.01,14,e.trim,.96),pr(r,.181,.162,.008,14,e.trim,.96),n.add(mt(r,{cast:!1,receive:!0}));let s=new ct;Hn(s,[{y:.075,rx:.187,rz:.139},{y:.105,rx:.198,rz:.147},{y:.155,rx:.192,rz:.144}],14,e.accent,{tone:1,fold:.004}),n.add(mt(s,{cast:!0,receive:!0}));let a=new ct;a.box(new E(0,.118,.198),new E(.07,.048,.014),"#C9A45E",1),a.box(new E(0,.118,.207),new E(.038,.024,.008),"#4A3322",1),n.add(mt(a,{cast:!1,receive:!0}));let o=new ct;Hn(o,[{y:.505,rx:.105,rz:.095},{y:.535,rx:.12,rz:.104},{y:.57,rx:.098,rz:.087}],12,mn(e.coat,.05),{tone:1}),pr(o,.1215,.505,.01,12,e.trim,1),Gc(o,12,.518,.558,.116,.101,.103,.091,e.trim,e.coat),n.add(mt(o,{cast:!0,receive:!0}));let l=ze(new rt(.045,0),"#5B4633",{cast:!1});l.scale.set(.8,1.05,.5),l.position.set(.15,.085,.115),l.rotation.z=.2,n.add(l);let c=ze(new we(.072,.022,.04),"#3F3126",{cast:!1});c.position.set(.148,.118,.122),c.rotation.z=.16,n.add(c);let h=ze(new nt(.056,.065,.13,8),e.skin,{cast:!0});return h.position.y=.575,n.add(h),t}function hm(n,e){let t=new Ce;t.position.set(-.105,.11,.145);let i=new ct,r=[{y:0,x0:-.038,x1:.038,z:.002},{y:-.1,x0:-.044,x1:.044,z:.02},{y:-.24,x0:-.03,x1:.03,z:.042}];for(let s=0;s<r.length-1;s++){let a=r[s],o=r[s+1];for(let l=0;l<2;l++){let c=l?a.x1:a.x0,h=l?o.x1:o.x0,u=new E(c,a.y,a.z),d=new E(l?o.x1:o.x0,o.y,o.z),p=new E(o.x1,o.y,o.z),m=new E(a.x1,a.y,a.z);i.splitQuad(u,d,p,m,e.accent,e.trim,Ii[(s+l)%3],1)}}return t.add(mt(i,{doubleSide:!0,cast:!1,receive:!0})),n.add(t),t}function um(n,e){let t=[{y:.02,rx:.176,rz:.13},{y:-.14,rx:.193,rz:.144},{y:-.3,rx:.22,rz:.173},{y:-.44,rx:.246,rz:.201},{y:-.5,rx:.256,rz:.211}],i=new ct;mr(i,t,16,e,{pattern:!1,fold:.005}),n.add(mt(i,{doubleSide:!0,cast:!0,receive:!0}));let r=new ct;Gc(r,16,-.492,-.436,.2545,.2095,.2485,.2035,e.trim,e.coat),n.add(mt(r,{doubleSide:!0,cast:!1,receive:!0}))}function dm(n,e){let t=[],r=fr/12,s=.5;for(let a=0;a<12;a++){let o=r*a,l=r*.8,h=.49+Math.abs(Math.cos(o))*.035,u=new ct,d=5,p=3,m=[];for(let M=0;M<=d;M++){let P=-h*(M/d),R=.178+M/d*.08,I=[];for(let N=0;N<=p;N++){let C=N/p,z=o-l+l*2*C,O=.006*Math.sin(a*2.3+M*1.7+N*1.2);I.push(new E(Math.sin(z)*(R+O),P,Math.cos(z)*(R+O)))}m.push(I)}for(let M=0;M<d;M++)for(let P=0;P<p;P++){let R=m[M][P],I=m[M][P+1],N=m[M+1][P+1],C=m[M+1][P],z=Ii[(a+M+P)%3],O=Ii[(a+M+P+1)%3],q=e.pattern&&Cd(a*101+M*17+P*5)<.5;u.tri(R,I,N,q?e.accent:e.coat,z),u.tri(R,N,C,q?e.coat:e.accent,O)}let x=[[1,1,0,1,1,1],[1,0,0,0,1,0],[1,1,0,1,1,1]],f=p*2,y=3,v=m[d-1],g=m[d],w=(M,P)=>{let R=v[Math.min(p-1,Math.floor(M*p))],I=v[Math.min(p,Math.floor(M*p)+1)],N=g[Math.min(p-1,Math.floor(M*p))],C=g[Math.min(p,Math.floor(M*p)+1)],z=M*p-Math.floor(M*p),O=R.clone().lerp(I,z),q=N.clone().lerp(C,z);return O.lerp(q,P)};for(let M=0;M<f;M++)for(let P=0;P<y;P++){let R=M/f,I=(M+1)/f,N=P/y,C=(P+1)/y,z=w(R,N),O=w(I,N),q=w(I,C),le=w(R,C);if(u.quad(z,O,q,le,e.trim,.98),x[P][M%6]){let Z=z.clone();Z.z+=.0035;let $=O.clone();$.z+=.0035;let U=q.clone();U.z+=.0035;let V=le.clone();V.z+=.0035,u.quad(Z,$,U,V,e.coat,1)}}let b=mt(u,{doubleSide:!0,cast:!0,receive:!0}),_=new Ce;_.userData.angle=o,_.add(b),n.add(_),t.push(_)}return t}function _d(n,e,t,i={}){let r=i.cols??9,s=i.rows??4,a=i.topY??-.086,o=i.sideRise??.064,l=i.length??.1,c=[];for(let u=0;u<=r;u++){let d=(-1+2*u/r)*1.34,p=[];for(let m=0;m<=s;m++){let x=m/s,f=.098-.04*x,y=.09-.032*x,v=a+o*Math.pow(Math.abs(Math.sin(d)),1.25)-l*x*(.7+.3*Math.cos(d));p.push(new E(Math.sin(d)*f,v,Math.cos(d)*y+.008))}c.push(p)}let h=new ct;for(let u=0;u<r;u++)for(let d=0;d<s;d++){let p=c[u][d],m=c[u+1][d],x=c[u+1][d+1],f=c[u][d+1];h.splitQuad(p,m,x,f,e,t,Ii[(u+d)%3],Ii[(u+d+1)%3])}n.add(mt(h,{doubleSide:!0,cast:!1,receive:!0}))}function pm(n,e){let t=n.skin,i=mn(t,.05),r=mn(t,-.075),s=mn(t,.015,.04),a=n.beardColor||"#3a2a22",o=mn(a,.018),l=mn(a,-.035),c=[{y:-.132,rx:.052,rz:.058,z:.01},{y:-.112,rx:.075,rz:.074,z:.008},{y:-.075,rx:.09,rz:.084,z:.004},{y:-.03,rx:.098,rz:.091,z:.001},{y:.02,rx:.1,rz:.096,z:0},{y:.07,rx:.099,rz:.101,z:.002},{y:.11,rx:.088,rz:.092,z:.004},{y:.14,rx:.048,rz:.054,z:.006}],h=new ct;mr(h,c,16,{...n,coat:t,accent:t},{fold:.0025}),e.add(mt(h,{cast:!0,receive:!0}));let u=new ct;for(let M of[-1,1])u.tri(new E(M*.01,-.004,.099),new E(M*.052,-.036,.08),new E(M*.068,-.004,.075),t,.99),u.tri(new E(M*.01,-.004,.099),new E(M*.068,-.004,.075),new E(M*.04,.015,.094),i,1.01);e.add(mt(u,{cast:!1,receive:!0}));let d=[],p=[];for(let M of[-1,1]){let P=new Ce;P.position.set(M*.04,.024,.0925),e.add(P);let R=ze(new Rn(.0148,7,5),"#cbb49e",{cast:!1});R.scale.set(1.15,.52,.34),P.add(R);let I=ze(new Rn(.0082,6,4),"#221711",{cast:!1});I.scale.set(1,1,.38),I.position.z=.0078,P.add(I);let N=ze(new Rn(.0015,4,3),"#ffe9cf",{basic:!0});N.position.set(.0022,.0026,.012),P.add(N);let C=ze(new we(.032,.0062,.01),t,{cast:!1});C.position.set(0,.0102,.0048),C.rotation.z=-M*.035,P.add(C);let z=ze(new we(.027,.003,.007),r,{cast:!1});z.position.set(0,-.0102,.0055),P.add(z);let O=ze(new we(.01,.0025,.005),"#2b1a12",{cast:!1});O.position.set(M*.013,.006,.01),O.rotation.z=M*.36,P.add(O),d.push({group:P,pupil:I,baseX:I.position.x,baseY:I.position.y});let q=n.beard==="full"?mn(a,-.05):"#3a2a22",le=ze(new we(.028,.0048,.007),q,{cast:!1});le.position.set(M*.042,.052,.093),le.rotation.z=M*.1,e.add(le),p.push({mesh:le,baseZ:le.rotation.z,baseY:le.position.y,side:M,part:0});let J=ze(new we(.01,.0042,.006),q,{cast:!1});J.position.set(M*.025,.0505,.094),J.rotation.z=M*.2,e.add(J),p.push({mesh:J,baseZ:J.rotation.z,baseY:J.position.y,side:M,part:1})}let m=new ct,x=new E(-.0075,.046,.0915),f=new E(.0075,.046,.0915),y=new E(.011,-.006,.101),v=new E(-.011,-.006,.101);m.quad(x,f,y,v,i,1.02),m.tri(new E(-.011,-.006,.101),new E(0,-.02,.108),new E(.011,-.006,.101),t,.98);for(let M of[-1,1])m.tri(new E(M*.011,-.006,.101),new E(M*.019,-.017,.099),new E(M*.008,-.02,.104),r,1),m.tri(new E(M*.019,-.017,.099),new E(M*.014,-.023,.104),new E(M*.008,-.02,.104),r,.94);e.add(mt(m,{cast:!1,receive:!0}));let g=new Ce;g.position.set(0,-.059,.096),e.add(g);let w=n.expression==="sing"?"open":n.expression==="smile"||n.expression==="tea"||n.expression==="warm"?"smile":"neutral";if(w==="open"){let M=ze(new Rn(.021,7,4),"#321916",{cast:!1});M.scale.set(1.25,.72,.3),g.add(M);let P=ze(new Rn(.01,5,3),"#7c3732",{cast:!1});P.scale.set(1,.4,.35),P.position.set(0,-.012,.009),g.add(P)}else{let M=w==="smile"?-.006:-.001,P=[new E(-.032,.002,0),new E(0,M,.003),new E(.032,.002,0)],R=ze(new or(new Ci(P),6,.0034,3,!1),"#5b3428",{cast:!1});g.add(R)}let b=ze(new we(.038,.0055,.009),"#985b4b",{cast:!1});b.position.set(0,-.011,.004),g.add(b);let _=ze(new we(.006,.011,.004),r,{cast:!1});_.position.set(0,-.04,.094),e.add(_);for(let M of[-1,1]){let P=ze(new Yt(.023,.005,3,8,Math.PI*1.5),t,{cast:!1});P.rotation.set(Math.PI/2,0,M*.2),P.position.set(M*.096,.004,.004),e.add(P);let R=ze(new rt(.012,0),i,{cast:!1});R.scale.set(.7,1,.55),R.position.set(M*.097,-.02,.006),e.add(R)}if(n.earring){let M=ze(new Yt(.013,.003,3,8),"#C9A45E",{cast:!1});M.rotation.y=Math.PI/2,M.position.set(.097,-.04,.01),e.add(M)}if(n.beard!=="none"){let M=new Ce;e.add(M);let P=()=>{for(let R of[-1,1]){let I=ze(new we(.022,.0042,.0055),a,{cast:!1});I.position.set(R*.014,-.052,.0975),I.rotation.z=-R*.3,M.add(I)}};if(n.beard==="full")_d(M,a,o,{length:.125,topY:-.088}),P();else if(n.beard==="mustache"){P();let R=ze(new yt(.014,.045,5),a,{cast:!1});R.rotation.x=Math.PI,R.position.set(0,-.138,.078),M.add(R)}else n.beard==="short"&&(_d(M,a,o,{length:.072,topY:-.1,sideRise:.05,rows:3}),P())}if(n.age>.4){for(let M=0;M<3;M++){let P=ze(new we(.055-M*.006,.0035,.006),r,{cast:!1});P.position.set(0,.088+M*.01,.092-M*.002),e.add(P)}for(let M of[-1,1]){let P=ze(new we(.03,.003,.005),r,{cast:!1});P.position.set(M*.073,.032,.082),P.rotation.z=M*.35,e.add(P);let R=ze(new we(.006,.045,.005),r,{cast:!1});R.position.set(M*.036,-.05,.094),R.rotation.z=M*.25,e.add(R)}}return e.userData.brows=p,{eyeGroups:d,brows:p,mouth:g,mouthKind:w,skinLight:i,skinShadow:r,beardColor:a}}function fm(n,e){let t=e.hatType,i=e.hatColor,r=e.accent,s=e.fur;if(t==="fur"){let a=new ct;Hn(a,[{y:.092,rx:.104,rz:.1},{y:.104,rx:.121,rz:.117},{y:.12,rx:.125,rz:.121},{y:.136,rx:.117,rz:.113},{y:.15,rx:.098,rz:.094}],11,s,{tone:1,fold:.01}),n.add(mt(a,{cast:!0,receive:!0}));let o=new ct;Hn(o,[{y:.144,rx:.094,rz:.09},{y:.176,rx:.085,rz:.082},{y:.204,rx:.066,rz:.063},{y:.216,rx:.032,rz:.031}],10,i,{tone:1}),pr(o,.096,.144,.01,10,r,.96),n.add(mt(o,{cast:!0,receive:!0}));let l=ze(new rt(.016,0),r,{cast:!1});l.position.y=.228,n.add(l)}else if(t==="peaked"){let a=new ct;Hn(a,[{y:.094,rx:.11,rz:.106},{y:.108,rx:.126,rz:.122},{y:.128,rx:.108,rz:.104}],12,s,{tone:1,fold:.006}),n.add(mt(a,{cast:!0,receive:!0}));let o=new ct;Hn(o,[{y:.124,rx:.094,rz:.09},{y:.168,rx:.08,rz:.077},{y:.196,rx:.052,rz:.05}],10,i,{tone:1}),pr(o,.096,.124,.012,10,r,.96),n.add(mt(o,{cast:!0,receive:!0}));let l=ze(new rt(.015,0),r,{cast:!1});l.position.y=.208,n.add(l)}else{let a=new ct;Hn(a,[{y:.096,rx:.106,rz:.102},{y:.126,rx:.11,rz:.106},{y:.14,rx:.098,rz:.094}],12,i,{tone:1}),pr(a,.109,.1,.014,12,r,.98),n.add(mt(a,{cast:!0,receive:!0}));let o=new ct;Hn(o,[{y:.138,rx:.096,rz:.092},{y:.176,rx:.08,rz:.077},{y:.198,rx:.04,rz:.038}],10,i,{tone:1}),n.add(mt(o,{cast:!0,receive:!0}));let l=ze(new rt(.013,0),r,{cast:!1});l.position.y=.208,n.add(l)}}function mm(n,e){if(e.hatType!=="none"){let i=e.beardColor||"#2a211c",r=ze(new rt(.09,0),mn(i,-.02),{cast:!1});if(r.scale.set(1,.48,.48),r.position.set(0,.038,-.072),n.add(r),e.sideburns!==!1)for(let s of[-1,1]){let a=ze(new we(.01,.052,.028),e.beardColor||"#2a211c",{cast:!1});a.position.set(s*.094,.004,.01),a.rotation.z=s*.08,n.add(a)}return}let t=ze(new Rn(.104,9,4,0,fr,0,Math.PI*.48),e.beardColor||"#2a211c",{cast:!1});if(t.scale.set(1,.72,1),t.position.y=.055,n.add(t),e.sideburns!==!1)for(let i of[-1,1]){let r=ze(new we(.012,.052,.026),e.beardColor||"#2a211c",{cast:!1});r.position.set(i*.094,0,.012),n.add(r)}}function gm(n,e){let t=new Ce,i=new ct,r=new E(0,-.04,.008);i.box(r,new E(.058,.075,.048),e,1),i.box(new E(0,-.078,.01),new E(.06,.016,.044),mn(e,-.035),1);for(let o=0;o<4;o++){let l=(o-1.5)*.0145,c=o===0||o===3?.046:.054,h=-.092;i.box(new E(l,h,.012),new E(.012,c*.55,.017),e,.98),i.box(new E(l,h-c*.43,.014),new E(.0105,c*.5,.015),mn(e,.025),1),i.box(new E(l,h-c*.75,.0185),new E(.008,.008,.01),"#d8b28e",1)}let s=n*-.038;i.box(new E(s,-.03,.02),new E(.02,.032,.02),e,.97),i.box(new E(s+n*-.008,-.055,.038),new E(.017,.035,.018),e,1),i.box(new E(s+n*-.012,-.07,.049),new E(.012,.012,.013),"#d8b28e",1);let a=ze(new nt(.036,.042,.038,6),mn(e,-.02),{cast:!1});return a.position.y=.006,t.add(a),t.add(mt(i,{cast:!1,receive:!0})),t}function vm(n,e,t){let i=new Ce,r=new ct,s="#493827",a="#1f1a16";r.box(new E(0,-.03,.048),new E(.088,.066,.14),s,1),r.box(new E(0,-.043,.132),new E(.073,.05,.06),mn(s,.03),1),r.box(new E(0,-.06,.054),new E(.094,.02,.205),a,1),r.box(new E(0,-.01,.152),new E(.06,.024,.042),s,1),r.box(new E(0,.014,-.012),new E(.078,.055,.078),s,1);let o=ze(new nt(.066,.073,.042,7),mn(s,.05),{cast:!1});return o.position.y=.04,i.add(o),i.add(mt(r,{cast:!0,receive:!0})),i}function xm(n,e,t){let s=new Ce;s.position.set(n*.235,.47,0);let a=new ct;mr(a,[{y:.01,rx:.086,rz:.083},{y:-.07,rx:.084,rz:.081},{y:-.175,rx:.076,rz:.073},{y:-.285,rx:.066,rz:.063}],10,e,{pattern:!!e.pattern,fold:.004});let l=ze(new rt(.077,0),e.coat,{cast:!0});l.scale.set(1,.62,.9),l.position.y=.004,s.add(l),s.add(mt(a,{cast:!0,receive:!0}));let c=new Ce;c.position.set(0,-.285,0),s.add(c);let h=new ct;mr(h,[{y:0,rx:.066,rz:.063},{y:-.06,rx:.063,rz:.06},{y:-.255,rx:.047,rz:.045}],10,e,{pattern:!!e.pattern,fold:.004});let d=new ct;Gc(d,10,-.212,-.176,.074,.07,.071,.067,e.trim,e.coat),pr(d,.0705,-.22,.008,10,mn(e.trim,-.04),1),c.add(mt(d,{cast:!1,receive:!0})),c.add(mt(h,{cast:!0,receive:!0}));let p=new Ce;p.position.set(0,-.255,0),c.add(p);let m=gm(n,e.skin);m.scale.setScalar(.88),p.add(m);let x=ze(new nt(.039,.044,.04,6),e.trim,{cast:!1});x.position.y=.012,p.add(x);let f={side:n,shoulder:s,elbow:c,wrist:p,root:s,fore:c,hand:p,L1:.285,L2:.255,talk:t==="seatTalk"&&n<0,baseTarget:new E,target:new E,desired:new E,pole:new E(n*.75,-.8,.25),update:null};return f.update=(y=.016,v=14)=>{let g=y<=0?1:1-Math.exp(-v*y);f.target.lerp(f.desired,g),Rd(f)},f}function Rd(n){let e=n.shoulder.position,t=n.target,i=new E().subVectors(t,e),r=i.length(),s=n.L1+n.L2-.008;r<.001&&(i.set(n.side*.01,-.1,.01),r=i.length()),r>s&&(i.multiplyScalar(s/r),r=s);let a=i.clone().normalize(),o=(n.L1*n.L1-n.L2*n.L2+r*r)/(2*r),l=Math.sqrt(Math.max(0,n.L1*n.L1-o*o)),c=n.pole.clone();c.addScaledVector(a,-c.dot(a)),c.lengthSq()<1e-6&&c.set(0,-1,0),c.normalize();let h=new E().copy(e).addScaledVector(a,o).addScaledVector(c,l),u=new E().subVectors(h,e).normalize();n.shoulder.quaternion.setFromUnitVectors(Sd,u);let d=new E().subVectors(t,h).normalize(),p=n.shoulder.quaternion.clone().invert(),m=d.clone().applyQuaternion(p).normalize();n.elbow.quaternion.setFromUnitVectors(Sd,m)}function ym(n,e){switch(n){case"seatTalk":return e<0?new E(-.36,.7,.23):new E(.22,.08,.3);case"seatListen":return new E(e*.2,.1,.31);case"seatTea":return new E(e*.12,.29,.34);case"seatWarm":return new E(e*.17,.3,.45);case"seatA":return new E(e*.2,.04,.3);case"seatB":return new E(e*.22,.06,.28);case"seatC":return new E(e*.12,.12,.34);case"carry":return new E(e*.18,.17,.36);case"reins":return new E(e*.15,.3,.3);case"point":return e<0?new E(-.36,.62,.33):new E(.21,.04,.14);default:return new E(e*.235,.015,.055)}}function Em(n,e,t){let i=[];for(let a of[-1,1]){let o=new Ce;o.position.set(a*.145,t,0),n.add(o);let l=new ct;mr(l,[{y:0,rx:.092,rz:.082},{y:-.08,rx:.089,rz:.08},{y:-.24,rx:.079,rz:.073},{y:-.415,rx:.071,rz:.065}],8,e,{pattern:!1,fold:.004}),o.add(mt(l,{cast:!0,receive:!0}));let h=new Ce;h.position.set(0,-.415,0),o.add(h);let u=[{y:0,rx:.072,rz:.068},{y:-.07,rx:.078,rz:.073},{y:-.25,rx:.064,rz:.06},{y:-.39,rx:.052,rz:.049}],d=new ct;mr(d,om(u,2),8,{...e,coat:"#493827"},{pattern:!1,fold:.003}),h.add(mt(d,{cast:!0,receive:!0}));let p=new Ce;p.position.set(0,-.39,0),h.add(p);let m=vm(a,e,e.skin);p.add(m);let x={side:a,hip:o,knee:h,ankle:p,foot:p,boot:m,L1:.415,L2:.39,hipX:a*.145,hipBase:t,phase:0,prevPhase:0,state:"stance",anchor:new E,swingStart:new E,landing:new E};i.push(x)}return i}function Mm(n,e){let t=new Ce;t.position.set(0,.27,.37);let i=ze(new nt(.076,.052,.072,9),"#8b5f36",{cast:!1});i.position.y=.036,t.add(i);let r=ze(new Yt(.078,.009,3,10),"#C9A45E",{cast:!1});r.rotation.x=Math.PI/2,r.position.y=.074,t.add(r);let s=ze(new nt(.069,.069,.006,10),"#2c1a12",{cast:!1});return s.position.y=.071,t.add(s),n.add(t),t}function wm(n,e){let t=new ct;for(let i=0;i<18;i++){let r=fr*i/18,s=new E(Math.sin(r)*.152,.455+Math.cos(r)*.024,Math.cos(r)*.172),a=i%4===0?.013:.01;t.box(s,new E(a,a,a),i%4===0?"#C9A45E":"#423326",1)}n.add(mt(t,{cast:!1,receive:!0}))}function Dd(n){let e={...n};e.height=e.height||1,e.skin=e.skin||"#B88C66",e.coat=e.coat||"#1C3357",e.accent=e.accent||"#C48A3A",e.trim=e.trim||"#B87A33",e.fur=e.fur||"#6B523D",e.hatColor=e.hatColor||"#5C3829",e.beardColor=e.beardColor||"#3a2a21",e.beard=e.beard||"none",e.hatType=e.hatType||"fur",e.expression=e.expression||"neutral",e.pose=e.pose||"seatA",e.earring=!!e.earring,e.beads=!!e.beads,e.sideburns=e.sideburns!==!1,e.age=e.age||0,e.legsKind=e.legs||null;let t=new Ce,i=e.pose!=="standing",r=.5,s=.42,a=new Ce;a.position.y=r,a.rotation.x=e.lean||0,t.add(a);let o=cm(a,e);um(a,e);let l=dm(a,e),c=hm(a,e);e.beads&&wm(a,e);let h=new Ce;h.position.set(0,.665,.012),h.rotation.set(e.headPitch||0,e.headTurn||0,e.tilt||0),h.scale.setScalar(1.04),a.add(h);let u=pm(e,h);mm(h,e),fm(h,e);let d=[];for(let g of[-1,1]){let w=xm(g,e,e.pose);a.add(w.shoulder),w.baseTarget.copy(ym(e.pose,g)),w.target.copy(w.baseTarget),w.desired.copy(w.baseTarget),Rd(w),d.push(w)}let p=Em(t,e,r),x=null;(e.pose==="seatTea"||e.pose==="seatC")&&(x=Mm(a,e));let f=i?0:s,y=f;a.position.y=r+y,p.forEach(g=>{g.hip.position.y=a.position.y});let v={upper:a,head:h,eyes:u.eyeGroups,brows:u.brows,mouth:u.mouth,mouthKind:u.mouthKind,arms:d,bowl:x,baseBowlY:x?x.position.y:0,sing:e.expression==="sing",tea:e.pose==="seatTea"||e.pose==="seatC",warm:e.pose==="seatWarm",listen:e.pose==="seatListen",talkArm:d.find(g=>g.talk)||null,baseUpperY:r,baseLean:e.lean||0,baseScale:e.height,baseHeadX:e.headPitch||0,baseHeadY:e.headTurn||0,baseHeadZ:e.tilt||0,eyeBaseY:e.expression==="sing"?.78:1,gazeY:e.pose==="seatTea"?-.004:e.expression==="sing"?.002:0,seatedGroup:new Ce,standGroup:new Ce,standShadow:null,standLegs:p,legs:p,standLift:y,standTarget:f,stood:!1,walking:!1,walkAmount:0,walkBlend:0,walkPhase:Math.random()*fr,leanOffset:0,speed:0,prevX:0,prevZ:0,targetYaw:0,gait:{initialized:!1,cycle:0,stride:1.05,stanceFrac:.58,moved:0},sashTail:c,sashBaseZ:c.rotation.z,sashBaseX:c.rotation.x,riding:!1,riderAttached:!1,hidden:!1,carryLog:null,animPhase:Math.random()*fr,noiseSeed:Math.random()*97,nextBlink:Math.random()*3.5,blinkStart:-10,doubleBlink:!1,speechEnv:0,speechStress:0,reactEnv:0,reactStress:0,speechBeat:0,lookTarget:new E,lookWeight:0,lookYaw:0,lookPitch:0,gazeX:0,robePanels:l,torsoRows:o,seatBlend:i?1:0};return t.userData.parts=v,t.scale.setScalar(e.height),t}function kc(n,e,t,i){let r=n.hip.position.y,s=n.hip.position.x,a=e-s,o=t-r,l=i,c=Math.max(.16,Math.min(Math.hypot(a,o,l),n.L1+n.L2-.004)),h=Math.atan2(l,-o),u=Math.acos(Math.max(-1,Math.min(1,(n.L1*n.L1+c*c-n.L2*n.L2)/(2*n.L1*c)))),d=Math.acos(Math.max(-1,Math.min(1,(n.L2*n.L2+c*c-n.L1*n.L1)/(2*n.L2*c)))),p=-h-u,m=u+d;return n.hip.rotation.x=p,n.hip.rotation.z=Math.max(-.42,Math.min(.42,Math.atan2(a,-o)*.6)),n.knee.rotation.x=m,n.ankle.rotation.x=-(p+m),{hipRotation:p,kneeRotation:m}}var Vc=1/1e3,bm=1e3,Cm=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(n){typeof document<"u"&&document.hidden!==void 0&&(n?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=n)}get delta(){return this._delta*Vc}get fixedDelta(){return this._fixedDelta*Vc}set fixedDelta(n){this._fixedDelta=n*bm}get elapsed(){return this._elapsed*Vc}update(n){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(n!==void 0?n:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(n){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},Rm=(()=>{let n=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),e=new Float32Array([0,0,2,0,0,2]),t=new tt;return t.setAttribute("position",new Ut(n,3)),t.setAttribute("uv",new Ut(e,2)),t})(),zn=class Yc{static get fullscreenGeometry(){return Rm}constructor(e="Pass",t=new bi,i=new nr){this.name=e,this.renderer=null,this.scene=t,this.camera=i,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(e){if(this.rtt===e){let t=this.fullscreenMaterial;t!==null&&(t.needsUpdate=!0),this.rtt=!e}}set mainScene(e){}set mainCamera(e){}setRenderer(e){this.renderer=e}isEnabled(){return this.enabled}setEnabled(e){this.enabled=e}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(e){let t=this.screen;t!==null?t.material=e:(t=new Je(Yc.fullscreenGeometry,e),t.frustumCulled=!1,this.scene===null&&(this.scene=new bi),this.scene.add(t),this.screen=t)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(e){this.fullscreenMaterial=e}getDepthTexture(){return null}setDepthTexture(e,t=_t){}render(e,t,i,r,s){throw new Error("Render method not implemented!")}setSize(e,t){}initialize(e,t,i){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof Fe||t instanceof wn||t instanceof Vt||t instanceof Yc)&&this[e].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},Dm=class extends zn{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(n,e,t,i,r){let s=n.state.buffers.stencil;s.setLocked(!1),s.setTest(!1)}},Pm=`#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <colorspace_fragment>
#include <dithering_fragment>
}`,Bd="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",Ud=class extends He{constructor(){super({name:"CopyMaterial",uniforms:{inputBuffer:new ue(null),opacity:new ue(1)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Pm,vertexShader:Bd})}set inputBuffer(n){this.uniforms.inputBuffer.value=n}setInputBuffer(n){this.uniforms.inputBuffer.value=n}getOpacity(n){return this.uniforms.opacity.value}setOpacity(n){this.uniforms.opacity.value=n}},Im=class extends zn{constructor(n,e=!0){super("CopyPass"),this.fullscreenMaterial=new Ud,this.needsSwap=!1,this.renderTarget=n,n===void 0&&(this.renderTarget=new Fe(1,1,{minFilter:Pt,magFilter:Pt,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=e}get resize(){return this.autoResize}set resize(n){this.autoResize=n}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(n){this.autoResize=n}render(n,e,t,i,r){this.fullscreenMaterial.inputBuffer=e.texture,n.setRenderTarget(this.renderToScreen?null:this.renderTarget),n.render(this.scene,this.camera)}setSize(n,e){this.autoResize&&this.renderTarget.setSize(n,e)}initialize(n,e,t){t!==void 0&&(this.renderTarget.texture.type=t,t!==ot?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":n!==null&&n.outputColorSpace===Ae&&(this.renderTarget.texture.colorSpace=Ae))}},Pd=new he,Nd=class extends zn{constructor(n=!0,e=!0,t=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=n,this.depth=e,this.stencil=t,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(n,e,t){this.color=n,this.depth=e,this.stencil=t}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(n){this.overrideClearColor=n}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(n){this.overrideClearAlpha=n}render(n,e,t,i,r){let s=this.overrideClearColor,a=this.overrideClearAlpha,o=n.getClearAlpha(),l=s!==null,c=a>=0;l?(n.getClearColor(Pd),n.setClearColor(s,c?a:o)):c&&n.setClearAlpha(a),n.setRenderTarget(this.renderToScreen?null:e),n.clear(this.color,this.depth,this.stencil),l?n.setClearColor(Pd,o):c&&n.setClearAlpha(o)}},Lm=class extends zn{constructor(n,e){super("MaskPass",n,e),this.needsSwap=!1,this.clearPass=new Nd(!1,!1,!0),this.inverse=!1}set mainScene(n){this.scene=n}set mainCamera(n){this.camera=n}get inverted(){return this.inverse}set inverted(n){this.inverse=n}get clear(){return this.clearPass.enabled}set clear(n){this.clearPass.enabled=n}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(n){this.inverted=n}render(n,e,t,i,r){let s=n.getContext(),a=n.state.buffers,o=this.scene,l=this.camera,c=this.clearPass,h=this.inverted?0:1,u=1-h;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.stencil.setFunc(s.ALWAYS,h,4294967295),a.stencil.setClear(u),a.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?c.render(n,null):(c.render(n,e),c.render(n,t))),this.renderToScreen?(n.setRenderTarget(null),n.render(o,l)):(n.setRenderTarget(e),n.render(o,l),n.setRenderTarget(t),n.render(o,l)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(s.EQUAL,1,4294967295),a.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.stencil.setLocked(!0)}},Od=class{constructor(n=null,{depthBuffer:e=!0,stencilBuffer:t=!1,multisampling:i=0,frameBufferType:r}={}){this.renderer=null,this.inputBuffer=this.createBuffer(e,t,r,i),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new Im,this.depthTexture=null,this.passes=[],this.timer=new Cm,this.autoRenderToScreen=!0,this.setRenderer(n)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(n){let e=this.inputBuffer,t=this.multisampling;t>0&&n>0?(this.inputBuffer.samples=n,this.outputBuffer.samples=n,this.inputBuffer.dispose(),this.outputBuffer.dispose()):t!==n&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(e.depthBuffer,e.stencilBuffer,e.texture.type,n),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(n){if(this.renderer=n,n!==null){let e=n.getSize(new k),t=n.getContext().getContextAttributes().alpha,i=this.inputBuffer.texture.type;i===ot&&n.outputColorSpace===Ae&&(this.inputBuffer.texture.colorSpace=Ae,this.outputBuffer.texture.colorSpace=Ae,this.inputBuffer.dispose(),this.outputBuffer.dispose()),n.autoClear=!1,this.setSize(e.width,e.height);for(let r of this.passes)r.initialize(n,t,i)}}replaceRenderer(n,e=!0){let t=this.renderer,i=t.domElement.parentNode;return this.setRenderer(n),e&&i!==null&&(i.removeChild(t.domElement),i.appendChild(n.domElement)),t}createDepthTexture(){let n=this.depthTexture=new ir;return this.inputBuffer.depthTexture=n,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(n.format=_i,n.type=ci):n.type=Xn,n}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(let n of this.passes)n.setDepthTexture(null)}}createBuffer(n,e,t,i){let r=this.renderer,s=r===null?new k:r.getDrawingBufferSize(new k),a={minFilter:Pt,magFilter:Pt,stencilBuffer:e,depthBuffer:n,type:t},o=new Fe(s.width,s.height,a);return i>0&&(o.ignoreDepthForMultisampleCopy=!1,o.samples=i),t===ot&&r!==null&&r.outputColorSpace===Ae&&(o.texture.colorSpace=Ae),o.texture.name="EffectComposer.Buffer",o.texture.generateMipmaps=!1,o}setMainScene(n){for(let e of this.passes)e.mainScene=n}setMainCamera(n){for(let e of this.passes)e.mainCamera=n}addPass(n,e){let t=this.passes,i=this.renderer,r=i.getDrawingBufferSize(new k),s=i.getContext().getContextAttributes().alpha,a=this.inputBuffer.texture.type;if(n.setRenderer(i),n.setSize(r.width,r.height),n.initialize(i,s,a),this.autoRenderToScreen&&(t.length>0&&(t[t.length-1].renderToScreen=!1),n.renderToScreen&&(this.autoRenderToScreen=!1)),e!==void 0?t.splice(e,0,n):t.push(n),this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!0),n.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){let o=this.createDepthTexture();for(n of t)n.setDepthTexture(o)}else n.setDepthTexture(this.depthTexture)}removePass(n){let e=this.passes,t=e.indexOf(n);if(t!==-1&&e.splice(t,1).length>0){if(this.depthTexture!==null){let s=(o,l)=>o||l.needsDepthTexture;e.reduce(s,!1)||(n.getDepthTexture()===this.depthTexture&&n.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&t===e.length&&(n.renderToScreen=!1,e.length>0&&(e[e.length-1].renderToScreen=!0))}}removeAllPasses(){let n=this.passes;this.deleteDepthTexture(),n.length>0&&(this.autoRenderToScreen&&(n[n.length-1].renderToScreen=!1),this.passes=[])}render(n){let e=this.renderer,t=this.copyPass,i=this.inputBuffer,r=this.outputBuffer,s=!1,a,o,l;n===void 0&&(this.timer.update(),n=this.timer.getDelta());for(let c of this.passes)c.enabled&&(c.render(e,i,r,n,s),c.needsSwap&&(s&&(t.renderToScreen=c.renderToScreen,a=e.getContext(),o=e.state.buffers.stencil,o.setFunc(a.NOTEQUAL,1,4294967295),t.render(e,i,r,n,s),o.setFunc(a.EQUAL,1,4294967295)),l=i,i=r,r=l),c instanceof Lm?s=!0:c instanceof Dm&&(s=!1))}setSize(n,e,t){let i=this.renderer,r=i.getSize(new k);(n===void 0||e===void 0)&&(n=r.width,e=r.height),(r.width!==n||r.height!==e)&&i.setSize(n,e,t);let s=i.getDrawingBufferSize(new k);this.inputBuffer.setSize(s.width,s.height),this.outputBuffer.setSize(s.width,s.height);for(let a of this.passes)a.setSize(s.width,s.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(let n of this.passes)n.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),zn.fullscreenGeometry.dispose()}},vr={NONE:0,DEPTH:1,CONVOLUTION:2},it={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},Bm=class{constructor(){this.shaderParts=new Map([[it.FRAGMENT_HEAD,null],[it.FRAGMENT_MAIN_UV,null],[it.FRAGMENT_MAIN_IMAGE,null],[it.VERTEX_HEAD,null],[it.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=vr.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=fn}};var Wc=!1,Id=class{constructor(n=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(n),this.meshCount=0,this.replaceMaterial=e=>{if(e.isMesh){let t;if(e.material.flatShading)switch(e.material.side){case jt:t=this.materialsFlatShadedDoubleSide;break;case Tt:t=this.materialsFlatShadedBackSide;break;default:t=this.materialsFlatShaded;break}else switch(e.material.side){case jt:t=this.materialsDoubleSide;break;case Tt:t=this.materialsBackSide;break;default:t=this.materials;break}this.originalMaterials.set(e,e.material),e.isSkinnedMesh?e.material=t[2]:e.isInstancedMesh?e.material=t[1]:e.material=t[0],++this.meshCount}}}cloneMaterial(n){if(!(n instanceof He))return n.clone();let e=n.uniforms,t=new Map;for(let r in e){let s=e[r].value;s.isRenderTargetTexture&&(e[r].value=null,t.set(r,s))}let i=n.clone();for(let r of t)e[r[0]].value=r[1],i.uniforms[r[0]].value=r[1];return i}setMaterial(n){if(this.disposeMaterials(),this.material=n,n!==null){let e=this.materials=[this.cloneMaterial(n),this.cloneMaterial(n),this.cloneMaterial(n)];for(let t of e)t.uniforms=Object.assign({},n.uniforms),t.side=jn;e[2].skinning=!0,this.materialsBackSide=e.map(t=>{let i=this.cloneMaterial(t);return i.uniforms=Object.assign({},n.uniforms),i.side=Tt,i}),this.materialsDoubleSide=e.map(t=>{let i=this.cloneMaterial(t);return i.uniforms=Object.assign({},n.uniforms),i.side=jt,i}),this.materialsFlatShaded=e.map(t=>{let i=this.cloneMaterial(t);return i.uniforms=Object.assign({},n.uniforms),i.flatShading=!0,i}),this.materialsFlatShadedBackSide=e.map(t=>{let i=this.cloneMaterial(t);return i.uniforms=Object.assign({},n.uniforms),i.flatShading=!0,i.side=Tt,i}),this.materialsFlatShadedDoubleSide=e.map(t=>{let i=this.cloneMaterial(t);return i.uniforms=Object.assign({},n.uniforms),i.flatShading=!0,i.side=jt,i})}}render(n,e,t){let i=n.shadowMap.enabled;if(n.shadowMap.enabled=!1,Wc){let r=this.originalMaterials;this.meshCount=0,e.traverse(this.replaceMaterial),n.render(e,t);for(let s of r)s[0].material=s[1];this.meshCount!==r.size&&r.clear()}else{let r=e.overrideMaterial;e.overrideMaterial=this.material,n.render(e,t),e.overrideMaterial=r}n.shadowMap.enabled=i}disposeMaterials(){if(this.material!==null){let n=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let e of n)e.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return Wc}static set workaroundEnabled(n){Wc=n}};var Li=-1,qn=class extends $t{constructor(n,e=Li,t=Li,i=1){super(),this.resizable=n,this.baseSize=new k(1,1),this.preferredSize=new k(e,t),this.target=this.preferredSize,this.s=i,this.effectiveSize=new k,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){let n=this.baseSize,e=this.preferredSize,t=this.effectiveSize,i=this.scale;e.width!==Li?t.width=e.width:e.height!==Li?t.width=Math.round(e.height*(n.width/Math.max(n.height,1))):t.width=Math.round(n.width*i),e.height!==Li?t.height=e.height:e.width!==Li?t.height=Math.round(e.width/Math.max(n.width/Math.max(n.height,1),1)):t.height=Math.round(n.height*i)}get width(){return this.effectiveSize.width}set width(n){this.preferredWidth=n}get height(){return this.effectiveSize.height}set height(n){this.preferredHeight=n}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(n){this.s!==n&&(this.s=n,this.preferredSize.setScalar(Li),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getScale(){return this.scale}setScale(n){this.scale=n}get baseWidth(){return this.baseSize.width}set baseWidth(n){this.baseSize.width!==n&&(this.baseSize.width=n,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseWidth(){return this.baseWidth}setBaseWidth(n){this.baseWidth=n}get baseHeight(){return this.baseSize.height}set baseHeight(n){this.baseSize.height!==n&&(this.baseSize.height=n,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseHeight(){return this.baseHeight}setBaseHeight(n){this.baseHeight=n}setBaseSize(n,e){(this.baseSize.width!==n||this.baseSize.height!==e)&&(this.baseSize.set(n,e),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(n){this.preferredSize.width!==n&&(this.preferredSize.width=n,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(n){this.preferredWidth=n}get preferredHeight(){return this.preferredSize.height}set preferredHeight(n){this.preferredSize.height!==n&&(this.preferredSize.height=n,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(n){this.preferredHeight=n}setPreferredSize(n,e){(this.preferredSize.width!==n||this.preferredSize.height!==e)&&(this.preferredSize.set(n,e),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}copy(n){this.s=n.scale,this.baseSize.set(n.baseWidth,n.baseHeight),this.preferredSize.set(n.preferredWidth,n.preferredHeight),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height)}static get AUTO_SIZE(){return Li}};var Be={SKIP:9,SET:30,ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Um="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y,opacity);}",Nm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,min(y.a,opacity));}",Om="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y)*0.5,opacity);}",Fm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.rg,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",Hm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(step(0.0,y)*(1.0-min(vec4(1.0),(1.0-x)/y)),vec4(1.0),step(1.0,x));return mix(x,z,opacity);}",zm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=step(0.0,x)*mix(min(vec4(1.0),x/max(1.0-y,1e-9)),vec4(1.0),step(1.0,y));return mix(x,z,opacity);}",Gm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x,y),opacity);}",km="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,abs(x-y),opacity);}",Vm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x/max(y,1e-12),opacity);}",Wm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y-2.0*x*y),opacity);}",Xm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 a=min(x,1.0),b=min(y,1.0);vec4 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,y));return mix(x,z,opacity);}",Ym="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,step(1.0,x+y),opacity);}",jm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.r,xHSL.gb));return vec4(mix(x.rgb,z,opacity),y.a);}",Zm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-y,opacity);}",Qm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y*(1.0-x),opacity);}",qm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x,y),opacity);}",Km="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(y+x-1.0,0.0,1.0),opacity);}",Jm="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x+y,1.0),opacity);}",$m="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(2.0*y+x-1.0,0.0,1.0),opacity);}",eg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.rg,yHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",tg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x*y,opacity);}",ng="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-abs(1.0-x-y),opacity);}",ig="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,opacity);}",rg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(2.0*y*x,1.0-2.0*(1.0-y)*(1.0-x),step(0.5,x));return mix(x,z,opacity);}",sg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 z=mix(mix(y2,x,step(0.5*x,y)),max(vec4(0.0),y2-1.0),step(x,(y2-1.0)));return mix(x,z,opacity);}",ag="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(min(x*x/max(1.0-y,1e-12),1.0),y,step(1.0,y));return mix(x,z,opacity);}",og="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.r,yHSL.g,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}",lg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y-min(x*y,1.0),opacity);}",cg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 w=step(0.5,y);vec4 z=mix(x-(1.0-y2)*x*(1.0-x),mix(x+(y2-1.0)*(sqrt(x)-x),x+(y2-1.0)*x*((16.0*x-12.0)*x+3.0),w*(1.0-step(0.25,x))),w);return mix(x,z,opacity);}",hg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}",ug="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x+y-1.0,0.0),opacity);}",dg="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(max(1.0-min((1.0-x)/(2.0*y),1.0),0.0),min(x/(2.0*(1.0-y)),1.0),step(0.5,y));return mix(x,z,opacity);}",pg=new Map([[Be.ADD,Um],[Be.ALPHA,Nm],[Be.AVERAGE,Om],[Be.COLOR,Fm],[Be.COLOR_BURN,Hm],[Be.COLOR_DODGE,zm],[Be.DARKEN,Gm],[Be.DIFFERENCE,km],[Be.DIVIDE,Vm],[Be.DST,null],[Be.EXCLUSION,Wm],[Be.HARD_LIGHT,Xm],[Be.HARD_MIX,Ym],[Be.HUE,jm],[Be.INVERT,Zm],[Be.INVERT_RGB,Qm],[Be.LIGHTEN,qm],[Be.LINEAR_BURN,Km],[Be.LINEAR_DODGE,Jm],[Be.LINEAR_LIGHT,$m],[Be.LUMINOSITY,eg],[Be.MULTIPLY,tg],[Be.NEGATION,ng],[Be.NORMAL,ig],[Be.OVERLAY,rg],[Be.PIN_LIGHT,sg],[Be.REFLECT,ag],[Be.SATURATION,og],[Be.SCREEN,lg],[Be.SOFT_LIGHT,cg],[Be.SRC,hg],[Be.SUBTRACT,ug],[Be.VIVID_LIGHT,dg]]),fg=class extends $t{constructor(n,e=1){super(),this._blendFunction=n,this.opacity=new ue(e)}getOpacity(){return this.opacity.value}setOpacity(n){this.opacity.value=n}get blendFunction(){return this._blendFunction}set blendFunction(n){this._blendFunction=n,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(n){this.blendFunction=n}getShaderCode(){return pg.get(this.blendFunction)}},jc={VERY_SMALL:0,SMALL:1,MEDIUM:2,LARGE:3,VERY_LARGE:4,HUGE:5},mg=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`,gg="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",vg=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],xg=class extends He{constructor(n=new et){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new ue(null),texelSize:new ue(new et),scale:new ue(1),kernel:new ue(0)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:mg,vertexShader:gg}),this.setTexelSize(n.x,n.y),this.kernelSize=jc.MEDIUM}set inputBuffer(n){this.uniforms.inputBuffer.value=n}setInputBuffer(n){this.inputBuffer=n}get kernelSequence(){return vg[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(n){this.uniforms.scale.value=n}getScale(){return this.uniforms.scale.value}setScale(n){this.uniforms.scale.value=n}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(n){this.uniforms.kernel.value=n}setKernel(n){this.kernel=n}setTexelSize(n,e){this.uniforms.texelSize.value.set(n,e,n*.5,e*.5)}setSize(n,e){let t=1/n,i=1/e;this.uniforms.texelSize.value.set(t,i,t*.5,i*.5)}},yg=class extends zn{constructor({kernelSize:n=jc.MEDIUM,resolutionScale:e=.5,width:t=qn.AUTO_SIZE,height:i=qn.AUTO_SIZE,resolutionX:r=t,resolutionY:s=i}={}){super("KawaseBlurPass"),this.renderTargetA=new Fe(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";let a=this.resolution=new qn(this,r,s,e);a.addEventListener("change",o=>this.setSize(a.baseWidth,a.baseHeight)),this._blurMaterial=new xg,this._blurMaterial.kernelSize=n,this.copyMaterial=new Ud}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(n){this._blurMaterial=n}get dithering(){return this.copyMaterial.dithering}set dithering(n){this.copyMaterial.dithering=n}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(n){this.blurMaterial.kernelSize=n}get width(){return this.resolution.width}set width(n){this.resolution.preferredWidth=n}get height(){return this.resolution.height}set height(n){this.resolution.preferredHeight=n}get scale(){return this.blurMaterial.scale}set scale(n){this.blurMaterial.scale=n}getScale(){return this.blurMaterial.scale}setScale(n){this.blurMaterial.scale=n}getKernelSize(){return this.kernelSize}setKernelSize(n){this.kernelSize=n}getResolutionScale(){return this.resolution.scale}setResolutionScale(n){this.resolution.scale=n}render(n,e,t,i,r){let s=this.scene,a=this.camera,o=this.renderTargetA,l=this.renderTargetB,c=this.blurMaterial,h=c.kernelSequence,u=e;this.fullscreenMaterial=c;for(let d=0,p=h.length;d<p;++d){let m=(d&1)===0?o:l;c.kernel=h[d],c.inputBuffer=u.texture,n.setRenderTarget(m),n.render(s,a),u=m}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=u.texture,n.setRenderTarget(this.renderToScreen?null:t),n.render(s,a)}setSize(n,e){let t=this.resolution;t.setBaseSize(n,e);let i=t.width,r=t.height;this.renderTargetA.setSize(i,r),this.renderTargetB.setSize(i,r),this.blurMaterial.setSize(n,e)}initialize(n,e,t){t!==void 0&&(this.renderTargetA.texture.type=t,this.renderTargetB.texture.type=t,t!==ot?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):n!==null&&n.outputColorSpace===Ae&&(this.renderTargetA.texture.colorSpace=Ae,this.renderTargetB.texture.colorSpace=Ae))}static get AUTO_SIZE(){return qn.AUTO_SIZE}},Eg=`#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);l*=low*high;
#elif defined(THRESHOLD)
l=smoothstep(threshold,threshold+smoothing,l)*l;
#endif
#ifdef COLOR
gl_FragColor=vec4(texel.rgb*clamp(l,0.0,1.0),l);
#else
gl_FragColor=vec4(l);
#endif
}`,Mg=class extends He{constructor(n=!1,e=null){super({name:"LuminanceMaterial",defines:{THREE_REVISION:"160".replace(/\D+/g,"")},uniforms:{inputBuffer:new ue(null),threshold:new ue(0),smoothing:new ue(1),range:new ue(null)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Eg,vertexShader:Bd}),this.colorOutput=n,this.luminanceRange=e}set inputBuffer(n){this.uniforms.inputBuffer.value=n}setInputBuffer(n){this.uniforms.inputBuffer.value=n}get threshold(){return this.uniforms.threshold.value}set threshold(n){this.smoothing>0||n>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.threshold.value=n}getThreshold(){return this.threshold}setThreshold(n){this.threshold=n}get smoothing(){return this.uniforms.smoothing.value}set smoothing(n){this.threshold>0||n>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.smoothing.value=n}getSmoothingFactor(){return this.smoothing}setSmoothingFactor(n){this.smoothing=n}get useThreshold(){return this.threshold>0||this.smoothing>0}set useThreshold(n){}get colorOutput(){return this.defines.COLOR!==void 0}set colorOutput(n){n?this.defines.COLOR="1":delete this.defines.COLOR,this.needsUpdate=!0}isColorOutputEnabled(n){return this.colorOutput}setColorOutputEnabled(n){this.colorOutput=n}get useRange(){return this.luminanceRange!==null}set useRange(n){this.luminanceRange=null}get luminanceRange(){return this.uniforms.range.value}set luminanceRange(n){n!==null?this.defines.RANGE="1":delete this.defines.RANGE,this.uniforms.range.value=n,this.needsUpdate=!0}getLuminanceRange(){return this.luminanceRange}setLuminanceRange(n){this.luminanceRange=n}},wg=class extends zn{constructor({renderTarget:n,luminanceRange:e,colorOutput:t,resolutionScale:i=1,width:r=qn.AUTO_SIZE,height:s=qn.AUTO_SIZE,resolutionX:a=r,resolutionY:o=s}={}){super("LuminancePass"),this.fullscreenMaterial=new Mg(t,e),this.needsSwap=!1,this.renderTarget=n,this.renderTarget===void 0&&(this.renderTarget=new Fe(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="LuminancePass.Target");let l=this.resolution=new qn(this,a,o,i);l.addEventListener("change",c=>this.setSize(l.baseWidth,l.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}render(n,e,t,i,r){let s=this.fullscreenMaterial;s.inputBuffer=e.texture,n.setRenderTarget(this.renderToScreen?null:this.renderTarget),n.render(this.scene,this.camera)}setSize(n,e){let t=this.resolution;t.setBaseSize(n,e),this.renderTarget.setSize(t.width,t.height)}initialize(n,e,t){t!==void 0&&t!==ot&&(this.renderTarget.texture.type=t,this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},Ag=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.0555555
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`,Sg="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",_g=class extends He{constructor(){super({name:"DownsamplingMaterial",uniforms:{inputBuffer:new ue(null),texelSize:new ue(new k)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Ag,vertexShader:Sg})}set inputBuffer(n){this.uniforms.inputBuffer.value=n}setSize(n,e){this.uniforms.texelSize.value.set(1/n,1/e)}},Tg=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`,bg="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",Cg=class extends He{constructor(){super({name:"UpsamplingMaterial",uniforms:{inputBuffer:new ue(null),supportBuffer:new ue(null),texelSize:new ue(new k),radius:new ue(.85)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Tg,vertexShader:bg})}set inputBuffer(n){this.uniforms.inputBuffer.value=n}set supportBuffer(n){this.uniforms.supportBuffer.value=n}get radius(){return this.uniforms.radius.value}set radius(n){this.uniforms.radius.value=n}setSize(n,e){this.uniforms.texelSize.value.set(1/n,1/e)}},Rg=class extends zn{constructor(){super("MipmapBlurPass"),this.needsSwap=!1,this.renderTarget=new Fe(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Upsampling.Mipmap0",this.downsamplingMipmaps=[],this.upsamplingMipmaps=[],this.downsamplingMaterial=new _g,this.upsamplingMaterial=new Cg,this.resolution=new k}get texture(){return this.renderTarget.texture}get levels(){return this.downsamplingMipmaps.length}set levels(n){if(this.levels!==n){let e=this.renderTarget;this.dispose(),this.downsamplingMipmaps=[],this.upsamplingMipmaps=[];for(let t=0;t<n;++t){let i=e.clone();i.texture.name="Downsampling.Mipmap"+t,this.downsamplingMipmaps.push(i)}this.upsamplingMipmaps.push(e);for(let t=1,i=n-1;t<i;++t){let r=e.clone();r.texture.name="Upsampling.Mipmap"+t,this.upsamplingMipmaps.push(r)}this.setSize(this.resolution.x,this.resolution.y)}}get radius(){return this.upsamplingMaterial.radius}set radius(n){this.upsamplingMaterial.radius=n}render(n,e,t,i,r){let{scene:s,camera:a}=this,{downsamplingMaterial:o,upsamplingMaterial:l}=this,{downsamplingMipmaps:c,upsamplingMipmaps:h}=this,u=e;this.fullscreenMaterial=o;for(let d=0,p=c.length;d<p;++d){let m=c[d];o.setSize(u.width,u.height),o.inputBuffer=u.texture,n.setRenderTarget(m),n.render(s,a),u=m}this.fullscreenMaterial=l;for(let d=h.length-1;d>=0;--d){let p=h[d];l.setSize(u.width,u.height),l.inputBuffer=u.texture,l.supportBuffer=c[d].texture,n.setRenderTarget(p),n.render(s,a),u=p}}setSize(n,e){let t=this.resolution;t.set(n,e);let i=t.width,r=t.height;for(let s=0,a=this.downsamplingMipmaps.length;s<a;++s)i=Math.round(i*.5),r=Math.round(r*.5),this.downsamplingMipmaps[s].setSize(i,r),s<this.upsamplingMipmaps.length&&this.upsamplingMipmaps[s].setSize(i,r)}initialize(n,e,t){if(t!==void 0){let i=this.downsamplingMipmaps.concat(this.upsamplingMipmaps);for(let r of i)r.texture.type=t;if(t!==ot)this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1";else if(n!==null&&n.outputColorSpace===Ae)for(let r of i)r.texture.colorSpace=Ae}}dispose(){super.dispose();for(let n of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))n.dispose()}},ns=class extends $t{constructor(n,e,{attributes:t=vr.NONE,blendFunction:i=Be.NORMAL,defines:r=new Map,uniforms:s=new Map,extensions:a=null,vertexShader:o=null}={}){super(),this.name=n,this.renderer=null,this.attributes=t,this.fragmentShader=e,this.vertexShader=o,this.defines=r,this.uniforms=s,this.extensions=a,this.blendMode=new fg(i),this.blendMode.addEventListener("change",l=>this.setChanged()),this._inputColorSpace=fn,this._outputColorSpace=dn}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(n){this._inputColorSpace=n,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n,this.setChanged()}set mainScene(n){}set mainCamera(n){}getName(){return this.name}setRenderer(n){this.renderer=n}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(n){this.attributes=n,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(n){this.fragmentShader=n,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(n){this.vertexShader=n,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(n,e=_t){}update(n,e,t){}setSize(n,e){}initialize(n,e,t){}dispose(){for(let n of Object.keys(this)){let e=this[n];(e instanceof Fe||e instanceof wn||e instanceof Vt||e instanceof zn)&&this[n].dispose()}}},Dg=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 texel=texture2D(map,uv);outputColor=vec4(texel.rgb*intensity,texel.a);}`,Fd=class extends ns{constructor({blendFunction:n=Be.SCREEN,luminanceThreshold:e=.9,luminanceSmoothing:t=.025,mipmapBlur:i=!1,intensity:r=1,radius:s=.85,levels:a=8,kernelSize:o=jc.LARGE,resolutionScale:l=.5,width:c=qn.AUTO_SIZE,height:h=qn.AUTO_SIZE,resolutionX:u=c,resolutionY:d=h}={}){super("BloomEffect",Dg,{blendFunction:n,uniforms:new Map([["map",new ue(null)],["intensity",new ue(r)]])}),this.renderTarget=new Fe(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Bloom.Target",this.blurPass=new yg({kernelSize:o}),this.luminancePass=new wg({colorOutput:!0}),this.luminanceMaterial.threshold=e,this.luminanceMaterial.smoothing=t,this.mipmapBlurPass=new Rg,this.mipmapBlurPass.enabled=i,this.mipmapBlurPass.radius=s,this.mipmapBlurPass.levels=a,this.uniforms.get("map").value=i?this.mipmapBlurPass.texture:this.renderTarget.texture;let p=this.resolution=new qn(this,u,d,l);p.addEventListener("change",m=>this.setSize(p.baseWidth,p.baseHeight))}get texture(){return this.mipmapBlurPass.enabled?this.mipmapBlurPass.texture:this.renderTarget.texture}getTexture(){return this.texture}getResolution(){return this.resolution}getBlurPass(){return this.blurPass}getLuminancePass(){return this.luminancePass}get luminanceMaterial(){return this.luminancePass.fullscreenMaterial}getLuminanceMaterial(){return this.luminancePass.fullscreenMaterial}get width(){return this.resolution.width}set width(n){this.resolution.preferredWidth=n}get height(){return this.resolution.height}set height(n){this.resolution.preferredHeight=n}get dithering(){return this.blurPass.dithering}set dithering(n){this.blurPass.dithering=n}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(n){this.blurPass.kernelSize=n}get distinction(){return console.warn(this.name,"distinction was removed"),1}set distinction(n){console.warn(this.name,"distinction was removed")}get intensity(){return this.uniforms.get("intensity").value}set intensity(n){this.uniforms.get("intensity").value=n}getIntensity(){return this.intensity}setIntensity(n){this.intensity=n}getResolutionScale(){return this.resolution.scale}setResolutionScale(n){this.resolution.scale=n}update(n,e,t){let i=this.renderTarget,r=this.luminancePass;r.enabled?(r.render(n,e),this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(n,r.renderTarget):this.blurPass.render(n,r.renderTarget,i)):this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(n,e):this.blurPass.render(n,e,i)}setSize(n,e){let t=this.resolution;t.setBaseSize(n,e),this.renderTarget.setSize(t.width,t.height),this.blurPass.resolution.copy(t),this.luminancePass.setSize(n,e),this.mipmapBlurPass.setSize(n,e)}initialize(n,e,t){this.blurPass.initialize(n,e,t),this.luminancePass.initialize(n,e,t),this.mipmapBlurPass.initialize(n,e,t),t!==void 0&&(this.renderTarget.texture.type=t,n!==null&&n.outputColorSpace===Ae&&(this.renderTarget.texture.colorSpace=Ae))}};var Pg="uniform float brightness;uniform float contrast;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=inputColor.rgb+vec3(brightness-0.5);if(contrast>0.0){color/=vec3(1.0-contrast);}else{color*=vec3(1.0+contrast);}outputColor=vec4(color+vec3(0.5),inputColor.a);}",Hd=class extends ns{constructor({blendFunction:n=Be.SRC,brightness:e=0,contrast:t=0}={}){super("BrightnessContrastEffect",Pg,{blendFunction:n,uniforms:new Map([["brightness",new ue(e)],["contrast",new ue(t)]])}),this.inputColorSpace=Ae}get brightness(){return this.uniforms.get("brightness").value}set brightness(n){this.uniforms.get("brightness").value=n}getBrightness(){return this.brightness}setBrightness(n){this.brightness=n}get contrast(){return this.uniforms.get("contrast").value}set contrast(n){this.uniforms.get("contrast").value=n}getContrast(){return this.contrast}setContrast(n){this.contrast=n}};var Ig=`#define QUALITY(q) ((q) < 5 ? 1.0 : ((q) > 5 ? ((q) < 10 ? 2.0 : ((q) < 11 ? 4.0 : 8.0)) : 1.5))
#define ONE_OVER_TWELVE 0.08333333333333333
varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;vec4 fxaa(const in vec4 inputColor,const in vec2 uv){float lumaCenter=luminance(inputColor.rgb);float lumaDown=luminance(texture2D(inputBuffer,vUvDown).rgb);float lumaUp=luminance(texture2D(inputBuffer,vUvUp).rgb);float lumaLeft=luminance(texture2D(inputBuffer,vUvLeft).rgb);float lumaRight=luminance(texture2D(inputBuffer,vUvRight).rgb);float lumaMin=min(lumaCenter,min(min(lumaDown,lumaUp),min(lumaLeft,lumaRight)));float lumaMax=max(lumaCenter,max(max(lumaDown,lumaUp),max(lumaLeft,lumaRight)));float lumaRange=lumaMax-lumaMin;if(lumaRange<max(EDGE_THRESHOLD_MIN,lumaMax*EDGE_THRESHOLD_MAX)){return inputColor;}float lumaDownLeft=luminance(texture2D(inputBuffer,vUvDownLeft).rgb);float lumaUpRight=luminance(texture2D(inputBuffer,vUvUpRight).rgb);float lumaUpLeft=luminance(texture2D(inputBuffer,vUvUpLeft).rgb);float lumaDownRight=luminance(texture2D(inputBuffer,vUvDownRight).rgb);float lumaDownUp=lumaDown+lumaUp;float lumaLeftRight=lumaLeft+lumaRight;float lumaLeftCorners=lumaDownLeft+lumaUpLeft;float lumaDownCorners=lumaDownLeft+lumaDownRight;float lumaRightCorners=lumaDownRight+lumaUpRight;float lumaUpCorners=lumaUpRight+lumaUpLeft;float edgeHorizontal=(abs(-2.0*lumaLeft+lumaLeftCorners)+abs(-2.0*lumaCenter+lumaDownUp)*2.0+abs(-2.0*lumaRight+lumaRightCorners));float edgeVertical=(abs(-2.0*lumaUp+lumaUpCorners)+abs(-2.0*lumaCenter+lumaLeftRight)*2.0+abs(-2.0*lumaDown+lumaDownCorners));bool isHorizontal=(edgeHorizontal>=edgeVertical);float stepLength=isHorizontal?texelSize.y:texelSize.x;float luma1=isHorizontal?lumaDown:lumaLeft;float luma2=isHorizontal?lumaUp:lumaRight;float gradient1=abs(luma1-lumaCenter);float gradient2=abs(luma2-lumaCenter);bool is1Steepest=gradient1>=gradient2;float gradientScaled=0.25*max(gradient1,gradient2);float lumaLocalAverage=0.0;if(is1Steepest){stepLength=-stepLength;lumaLocalAverage=0.5*(luma1+lumaCenter);}else{lumaLocalAverage=0.5*(luma2+lumaCenter);}vec2 currentUv=uv;if(isHorizontal){currentUv.y+=stepLength*0.5;}else{currentUv.x+=stepLength*0.5;}vec2 offset=isHorizontal?vec2(texelSize.x,0.0):vec2(0.0,texelSize.y);vec2 uv1=currentUv-offset*QUALITY(0);vec2 uv2=currentUv+offset*QUALITY(0);float lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);float lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd1-=lumaLocalAverage;lumaEnd2-=lumaLocalAverage;bool reached1=abs(lumaEnd1)>=gradientScaled;bool reached2=abs(lumaEnd2)>=gradientScaled;bool reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(1);}if(!reached2){uv2+=offset*QUALITY(1);}if(!reachedBoth){for(int i=2;i<SAMPLES;++i){if(!reached1){lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);lumaEnd1=lumaEnd1-lumaLocalAverage;}if(!reached2){lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd2=lumaEnd2-lumaLocalAverage;}reached1=abs(lumaEnd1)>=gradientScaled;reached2=abs(lumaEnd2)>=gradientScaled;reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(i);}if(!reached2){uv2+=offset*QUALITY(i);}if(reachedBoth){break;}}}float distance1=isHorizontal?(uv.x-uv1.x):(uv.y-uv1.y);float distance2=isHorizontal?(uv2.x-uv.x):(uv2.y-uv.y);bool isDirection1=distance1<distance2;float distanceFinal=min(distance1,distance2);float edgeThickness=(distance1+distance2);bool isLumaCenterSmaller=lumaCenter<lumaLocalAverage;bool correctVariation1=(lumaEnd1<0.0)!=isLumaCenterSmaller;bool correctVariation2=(lumaEnd2<0.0)!=isLumaCenterSmaller;bool correctVariation=isDirection1?correctVariation1:correctVariation2;float pixelOffset=-distanceFinal/edgeThickness+0.5;float finalOffset=correctVariation?pixelOffset:0.0;float lumaAverage=ONE_OVER_TWELVE*(2.0*(lumaDownUp+lumaLeftRight)+lumaLeftCorners+lumaRightCorners);float subPixelOffset1=clamp(abs(lumaAverage-lumaCenter)/lumaRange,0.0,1.0);float subPixelOffset2=(-2.0*subPixelOffset1+3.0)*subPixelOffset1*subPixelOffset1;float subPixelOffsetFinal=subPixelOffset2*subPixelOffset2*SUBPIXEL_QUALITY;finalOffset=max(finalOffset,subPixelOffsetFinal);vec2 finalUv=uv;if(isHorizontal){finalUv.y+=finalOffset*stepLength;}else{finalUv.x+=finalOffset*stepLength;}return texture2D(inputBuffer,finalUv);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=fxaa(inputColor,uv);}`,Lg="varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;void mainSupport(const in vec2 uv){vUvDown=uv+vec2(0.0,-1.0)*texelSize;vUvUp=uv+vec2(0.0,1.0)*texelSize;vUvRight=uv+vec2(1.0,0.0)*texelSize;vUvLeft=uv+vec2(-1.0,0.0)*texelSize;vUvDownLeft=uv+vec2(-1.0,-1.0)*texelSize;vUvUpRight=uv+vec2(1.0,1.0)*texelSize;vUvUpLeft=uv+vec2(-1.0,1.0)*texelSize;vUvDownRight=uv+vec2(1.0,-1.0)*texelSize;}",zd=class extends ns{constructor({blendFunction:n=Be.SRC}={}){super("FXAAEffect",Ig,{vertexShader:Lg,blendFunction:n,defines:new Map([["EDGE_THRESHOLD_MIN","0.0312"],["EDGE_THRESHOLD_MAX","0.125"],["SUBPIXEL_QUALITY","0.75"],["SAMPLES","12"]])})}get minEdgeThreshold(){return Number(this.defines.get("EDGE_THRESHOLD_MIN"))}set minEdgeThreshold(n){this.defines.set("EDGE_THRESHOLD_MIN",n.toFixed(12)),this.setChanged()}get maxEdgeThreshold(){return Number(this.defines.get("EDGE_THRESHOLD_MAX"))}set maxEdgeThreshold(n){this.defines.set("EDGE_THRESHOLD_MAX",n.toFixed(12)),this.setChanged()}get subpixelQuality(){return Number(this.defines.get("SUBPIXEL_QUALITY"))}set subpixelQuality(n){this.defines.set("SUBPIXEL_QUALITY",n.toFixed(12)),this.setChanged()}get samples(){return Number(this.defines.get("SAMPLES"))}set samples(n){this.defines.set("SAMPLES",n.toFixed(0)),this.setChanged()}};var Gd=class extends zn{constructor(n,e,t=null){super("RenderPass",n,e),this.needsSwap=!1,this.clearPass=new Nd,this.overrideMaterialManager=t===null?null:new Id(t),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(n){this.scene=n}set mainCamera(n){this.camera=n}get renderToScreen(){return super.renderToScreen}set renderToScreen(n){super.renderToScreen=n,this.clearPass.renderToScreen=n}get overrideMaterial(){let n=this.overrideMaterialManager;return n!==null?n.material:null}set overrideMaterial(n){let e=this.overrideMaterialManager;n!==null?e!==null?e.setMaterial(n):this.overrideMaterialManager=new Id(n):e!==null&&(e.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(n){this.overrideMaterial=n}get clear(){return this.clearPass.enabled}set clear(n){this.clearPass.enabled=n}getSelection(){return this.selection}setSelection(n){this.selection=n}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(n){this.ignoreBackground=n}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(n){this.skipShadowMapUpdate=n}getClearPass(){return this.clearPass}render(n,e,t,i,r){let s=this.scene,a=this.camera,o=this.selection,l=a.layers.mask,c=s.background,h=n.shadowMap.autoUpdate,u=this.renderToScreen?null:e;o!==null&&a.layers.set(o.getLayer()),this.skipShadowMapUpdate&&(n.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(s.background=null),this.clearPass.enabled&&this.clearPass.render(n,e),n.setRenderTarget(u),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(n,s,a):n.render(s,a),a.layers.mask=l,s.background=c,n.shadowMap.autoUpdate=h}};var Bg="uniform vec3 hue;uniform float saturation;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(dot(inputColor.rgb,hue.xyz),dot(inputColor.rgb,hue.zxy),dot(inputColor.rgb,hue.yzx));float average=(color.r+color.g+color.b)/3.0;vec3 diff=average-color;if(saturation>0.0){color+=diff*(1.0-1.0/(1.001-saturation));}else{color+=diff*-saturation;}outputColor=vec4(min(color,1.0),inputColor.a);}",kd=class extends ns{constructor({blendFunction:n=Be.SRC,hue:e=0,saturation:t=0}={}){super("HueSaturationEffect",Bg,{blendFunction:n,uniforms:new Map([["hue",new ue(new E)],["saturation",new ue(t)]])}),this.hue=e}get saturation(){return this.uniforms.get("saturation").value}set saturation(n){this.uniforms.get("saturation").value=n}getSaturation(){return this.saturation}setSaturation(n){this.saturation=n}get hue(){let n=this.uniforms.get("hue").value;return Math.acos((n.x*3-1)/2)}set hue(n){let e=Math.sin(n),t=Math.cos(n);this.uniforms.get("hue").value.set((2*t+1)/3,(-Math.sqrt(3)*e-t+1)/3,(Math.sqrt(3)*e-t+1)/3)}getHue(){return this.hue}setHue(n){this.hue=n}};var ks={DEFAULT:0,ESKIL:1};var Ug=`void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 noise=vec3(rand(uv*(1.0+time)));
#ifdef PREMULTIPLY
outputColor=vec4(min(inputColor.rgb*noise,vec3(1.0)),inputColor.a);
#else
outputColor=vec4(noise,inputColor.a);
#endif
}`,Vd=class extends ns{constructor({blendFunction:n=Be.SCREEN,premultiply:e=!1}={}){super("NoiseEffect",Ug,{blendFunction:n}),this.premultiply=e}get premultiply(){return this.defines.has("PREMULTIPLY")}set premultiply(n){this.premultiply!==n&&(n?this.defines.set("PREMULTIPLY","1"):this.defines.delete("PREMULTIPLY"),this.setChanged())}isPremultiplied(){return this.premultiply}setPremultiplied(n){this.premultiply=n}};var Ey=Math.PI*.5;var Ng=`uniform float offset;uniform float darkness;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){const vec2 center=vec2(0.5);vec3 color=inputColor.rgb;
#if VIGNETTE_TECHNIQUE == 0
float d=distance(uv,center);color*=smoothstep(0.8,offset*0.799,d*(darkness+offset));
#else
vec2 coord=(uv-center)*vec2(offset);color=mix(color,vec3(1.0-darkness),dot(coord,coord));
#endif
outputColor=vec4(color,inputColor.a);}`,Wd=class extends ns{constructor({blendFunction:n,eskil:e=!1,technique:t=e?ks.ESKIL:ks.DEFAULT,offset:i=.5,darkness:r=.5}={}){super("VignetteEffect",Ng,{blendFunction:n,defines:new Map([["VIGNETTE_TECHNIQUE",t.toFixed(0)]]),uniforms:new Map([["offset",new ue(i)],["darkness",new ue(r)]])})}get technique(){return Number(this.defines.get("VIGNETTE_TECHNIQUE"))}set technique(n){this.technique!==n&&(this.defines.set("VIGNETTE_TECHNIQUE",n.toFixed(0)),this.setChanged())}get eskil(){return this.technique===ks.ESKIL}set eskil(n){this.technique=n?ks.ESKIL:ks.DEFAULT}getTechnique(){return this.technique}setTechnique(n){this.technique=n}get offset(){return this.uniforms.get("offset").value}set offset(n){this.uniforms.get("offset").value=n}getOffset(){return this.offset}setOffset(n){this.offset=n}get darkness(){return this.uniforms.get("darkness").value}set darkness(n){this.uniforms.get("darkness").value=n}getDarkness(){return this.darkness}setDarkness(n){this.darkness=n}};var Og=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,Fg="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",Hg=class extends He{constructor(n,e,t,i,r=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:"160".replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new ue(null),depthBuffer:new ue(null),resolution:new ue(new k),texelSize:new ue(new k),cameraNear:new ue(.3),cameraFar:new ue(1e3),aspect:new ue(1),time:new ue(0)},blending:ft,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:r}),n&&this.setShaderParts(n),e&&this.setDefines(e),t&&this.setUniforms(t),this.copyCameraSettings(i)}set inputBuffer(n){this.uniforms.inputBuffer.value=n}setInputBuffer(n){this.uniforms.inputBuffer.value=n}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(n){this.uniforms.depthBuffer.value=n}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(n){this.defines.DEPTH_PACKING=n.toFixed(0),this.needsUpdate=!0}setDepthBuffer(n,e=_t){this.depthBuffer=n,this.depthPacking=e}setShaderData(n){this.setShaderParts(n.shaderParts),this.setDefines(n.defines),this.setUniforms(n.uniforms),this.setExtensions(n.extensions)}setShaderParts(n){return this.fragmentShader=Og.replace(it.FRAGMENT_HEAD,n.get(it.FRAGMENT_HEAD)||"").replace(it.FRAGMENT_MAIN_UV,n.get(it.FRAGMENT_MAIN_UV)||"").replace(it.FRAGMENT_MAIN_IMAGE,n.get(it.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=Fg.replace(it.VERTEX_HEAD,n.get(it.VERTEX_HEAD)||"").replace(it.VERTEX_MAIN_SUPPORT,n.get(it.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(n){for(let e of n.entries())this.defines[e[0]]=e[1];return this.needsUpdate=!0,this}setUniforms(n){for(let e of n.entries())this.uniforms[e[0]]=e[1];return this}setExtensions(n){this.extensions={};for(let e of n)this.extensions[e]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(n){this.encodeOutput!==n&&(n?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(n){return this.encodeOutput}setOutputEncodingEnabled(n){this.encodeOutput=n}get time(){return this.uniforms.time.value}set time(n){this.uniforms.time.value=n}setDeltaTime(n){this.uniforms.time.value+=n}adoptCameraSettings(n){this.copyCameraSettings(n)}copyCameraSettings(n){n&&(this.uniforms.cameraNear.value=n.near,this.uniforms.cameraFar.value=n.far,n instanceof At?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(n,e){let t=this.uniforms;t.resolution.value.set(n,e),t.texelSize.value.set(1/n,1/e),t.aspect.value=n/e}static get Section(){return it}};var jy=Number("160".replace(/\D+/g,"")),gr=255/256,Zy=new Float32Array([gr/256**3,gr/256**2,gr/256,gr]),Qy=new Float32Array([gr,gr/256,gr/256**2,1/256**3]);function Ld(n,e,t){for(let i of e){let r="$1"+n+i.charAt(0).toUpperCase()+i.slice(1),s=new RegExp("([^\\.])(\\b"+i+"\\b)","g");for(let a of t.entries())a[1]!==null&&t.set(a[0],a[1].replace(s,r))}}function zg(n,e,t){let i=e.getFragmentShader(),r=e.getVertexShader(),s=i!==void 0&&/mainImage/.test(i),a=i!==void 0&&/mainUv/.test(i);if(t.attributes|=e.getAttributes(),i===void 0)throw new Error(`Missing fragment shader (${e.name})`);if(a&&(t.attributes&vr.CONVOLUTION)!==0)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${e.name})`);if(!s&&!a)throw new Error(`Could not find mainImage or mainUv function (${e.name})`);{let o=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,l=t.shaderParts,c=l.get(it.FRAGMENT_HEAD)||"",h=l.get(it.FRAGMENT_MAIN_UV)||"",u=l.get(it.FRAGMENT_MAIN_IMAGE)||"",d=l.get(it.VERTEX_HEAD)||"",p=l.get(it.VERTEX_MAIN_SUPPORT)||"",m=new Set,x=new Set;if(a&&(h+=`	${n}MainUv(UV);
`,t.uvTransformation=!0),r!==null&&/mainSupport/.test(r)){let v=/mainSupport *\([\w\s]*?uv\s*?\)/.test(r);p+=`	${n}MainSupport(`,p+=v?`vUv);
`:`);
`;for(let g of r.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(let w of g[1].split(/\s*,\s*/))t.varyings.add(w),m.add(w),x.add(w);for(let g of r.matchAll(o))x.add(g[1])}for(let v of i.matchAll(o))x.add(v[1]);for(let v of e.defines.keys())x.add(v.replace(/\([\w\s,]*\)/g,""));for(let v of e.uniforms.keys())x.add(v);x.delete("while"),x.delete("for"),x.delete("if"),e.uniforms.forEach((v,g)=>t.uniforms.set(n+g.charAt(0).toUpperCase()+g.slice(1),v)),e.defines.forEach((v,g)=>t.defines.set(n+g.charAt(0).toUpperCase()+g.slice(1),v));let f=new Map([["fragment",i],["vertex",r]]);Ld(n,x,t.defines),Ld(n,x,f),i=f.get("fragment"),r=f.get("vertex");let y=e.blendMode;if(t.blendModes.set(y.blendFunction,y),s){e.inputColorSpace!==null&&e.inputColorSpace!==t.colorSpace&&(u+=e.inputColorSpace===Ae?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),e.outputColorSpace!==dn?t.colorSpace=e.outputColorSpace:e.inputColorSpace!==null&&(t.colorSpace=e.inputColorSpace);let v=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;u+=`${n}MainImage(color0, UV, `,(t.attributes&vr.DEPTH)!==0&&v.test(i)&&(u+="depth, ",t.readDepth=!0),u+=`color1);
	`;let g=n+"BlendOpacity";t.uniforms.set(g,y.opacity),u+=`color0 = blend${y.blendFunction}(color0, color1, ${g});

	`,c+=`uniform float ${g};

`}if(c+=i+`
`,r!==null&&(d+=r+`
`),l.set(it.FRAGMENT_HEAD,c),l.set(it.FRAGMENT_MAIN_UV,h),l.set(it.FRAGMENT_MAIN_IMAGE,u),l.set(it.VERTEX_HEAD,d),l.set(it.VERTEX_MAIN_SUPPORT,p),e.extensions!==null)for(let v of e.extensions)t.extensions.add(v)}}var Xd=class extends zn{constructor(n,...e){super("EffectPass"),this.fullscreenMaterial=new Hg(null,null,null,n),this.listener=t=>this.handleEvent(t),this.effects=[],this.setEffects(e),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(n){for(let e of this.effects)e.mainScene=n}set mainCamera(n){this.fullscreenMaterial.copyCameraSettings(n);for(let e of this.effects)e.mainCamera=n}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(n){this.fullscreenMaterial.encodeOutput=n}get dithering(){return this.fullscreenMaterial.dithering}set dithering(n){let e=this.fullscreenMaterial;e.dithering=n,e.needsUpdate=!0}setEffects(n){for(let e of this.effects)e.removeEventListener("change",this.listener);this.effects=n.sort((e,t)=>t.attributes-e.attributes);for(let e of this.effects)e.addEventListener("change",this.listener)}updateMaterial(){let n=new Bm,e=0;for(let a of this.effects)if(a.blendMode.blendFunction===Be.DST)n.attributes|=a.getAttributes()&vr.DEPTH;else{if((n.attributes&a.getAttributes()&vr.CONVOLUTION)!==0)throw new Error(`Convolution effects cannot be merged (${a.name})`);zg("e"+e++,a,n)}let t=n.shaderParts.get(it.FRAGMENT_HEAD),i=n.shaderParts.get(it.FRAGMENT_MAIN_IMAGE),r=n.shaderParts.get(it.FRAGMENT_MAIN_UV),s=/\bblend\b/g;for(let a of n.blendModes.values())t+=a.getShaderCode().replace(s,`blend${a.blendFunction}`)+`
`;(n.attributes&vr.DEPTH)!==0?(n.readDepth&&(i=`float depth = readDepth(UV);

	`+i),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,n.colorSpace===Ae&&(i+=`color0 = sRGBToLinear(color0);
	`),n.uvTransformation?(r=`vec2 transformedUv = vUv;
`+r,n.defines.set("UV","transformedUv")):n.defines.set("UV","vUv"),n.shaderParts.set(it.FRAGMENT_HEAD,t),n.shaderParts.set(it.FRAGMENT_MAIN_IMAGE,i),n.shaderParts.set(it.FRAGMENT_MAIN_UV,r);for(let[a,o]of n.shaderParts)o!==null&&n.shaderParts.set(a,o.trim().replace(/^#/,`
#`));this.skipRendering=e===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(n)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(n,e=_t){this.fullscreenMaterial.depthBuffer=n,this.fullscreenMaterial.depthPacking=e;for(let t of this.effects)t.setDepthTexture(n,e)}render(n,e,t,i,r){for(let s of this.effects)s.update(n,e,i);if(!this.skipRendering||this.renderToScreen){let s=this.fullscreenMaterial;s.inputBuffer=e.texture,s.time+=i*this.timeScale,n.setRenderTarget(this.renderToScreen?null:t),n.render(this.scene,this.camera)}}setSize(n,e){this.fullscreenMaterial.setSize(n,e);for(let t of this.effects)t.setSize(n,e)}initialize(n,e,t){this.renderer=n;for(let i of this.effects)i.initialize(n,e,t);this.updateMaterial(),t!==void 0&&t!==ot&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(let n of this.effects)n.removeEventListener("change",this.listener),n.dispose()}handleEvent(n){n.type==="change"&&this.recompile()}};var $y=[new Float32Array(3),new Float32Array(3)],eE=[new Float32Array(3),new Float32Array(3),new Float32Array(3),new Float32Array(3)],tE=[[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1])]];var nE=[new Float32Array(2),new Float32Array(2)];var iE=new Float32Array([0,-.25,.25,-.125,.125,-.375,.375]),rE=[new Float32Array([0,0]),new Float32Array([.25,-.25]),new Float32Array([-.25,.25]),new Float32Array([.125,-.125]),new Float32Array([-.125,.125])],sE=[new Uint8Array([0,0]),new Uint8Array([3,0]),new Uint8Array([0,3]),new Uint8Array([3,3]),new Uint8Array([1,0]),new Uint8Array([4,0]),new Uint8Array([1,3]),new Uint8Array([4,3]),new Uint8Array([0,1]),new Uint8Array([3,1]),new Uint8Array([0,4]),new Uint8Array([3,4]),new Uint8Array([1,1]),new Uint8Array([4,1]),new Uint8Array([1,4]),new Uint8Array([4,4])],aE=[new Uint8Array([0,0]),new Uint8Array([1,0]),new Uint8Array([0,2]),new Uint8Array([1,2]),new Uint8Array([2,0]),new Uint8Array([3,0]),new Uint8Array([2,2]),new Uint8Array([3,2]),new Uint8Array([0,1]),new Uint8Array([1,1]),new Uint8Array([0,3]),new Uint8Array([1,3]),new Uint8Array([2,1]),new Uint8Array([3,1]),new Uint8Array([2,3]),new Uint8Array([3,3])];var lE=new Map([[tn(0,0,0,0),new Float32Array([0,0,0,0])],[tn(0,0,0,1),new Float32Array([0,0,0,1])],[tn(0,0,1,0),new Float32Array([0,0,1,0])],[tn(0,0,1,1),new Float32Array([0,0,1,1])],[tn(0,1,0,0),new Float32Array([0,1,0,0])],[tn(0,1,0,1),new Float32Array([0,1,0,1])],[tn(0,1,1,0),new Float32Array([0,1,1,0])],[tn(0,1,1,1),new Float32Array([0,1,1,1])],[tn(1,0,0,0),new Float32Array([1,0,0,0])],[tn(1,0,0,1),new Float32Array([1,0,0,1])],[tn(1,0,1,0),new Float32Array([1,0,1,0])],[tn(1,0,1,1),new Float32Array([1,0,1,1])],[tn(1,1,0,0),new Float32Array([1,1,0,0])],[tn(1,1,0,1),new Float32Array([1,1,0,1])],[tn(1,1,1,0),new Float32Array([1,1,1,0])],[tn(1,1,1,1),new Float32Array([1,1,1,1])]]);function Xc(n,e,t){return n+(e-n)*t}function tn(n,e,t,i){let r=Xc(n,e,.75),s=Xc(t,i,1-.25);return Xc(r,s,1-.125)}var Ni=document.getElementById("stage"),It=new Ps({antialias:!1,powerPreference:"high-performance"});It.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));It.setSize(Ni.clientWidth,Ni.clientHeight,!1);It.shadowMap.enabled=!0;It.shadowMap.type=Dc;It.shadowMap.autoUpdate=!1;It.shadowMap.needsUpdate=!0;It.toneMapping=Ic;It.toneMappingExposure=1.24;It.outputColorSpace=Ae;It.domElement.setAttribute("role","img");It.domElement.setAttribute("aria-label","Interactive low-poly Mongolian winter camp at sunset");Ni.appendChild(It.domElement);var Xe=new bi;Xe.fog=new ro(13607348,65,380);var vt=new At(50,Ni.clientWidth/Ni.clientHeight,.1,1600);vt.position.set(.5,4,10.5);var Ct=new So(vt,It.domElement);Ct.target.set(0,2.3,-3.5);Ct.enableDamping=!0;Ct.dampingFactor=.055;Ct.enablePan=!1;Ct.minDistance=8;Ct.maxDistance=26;Ct.minPolarAngle=1.2;Ct.maxPolarAngle=1.53;Ct.minAzimuthAngle=-.35;Ct.maxAzimuthAngle=.35;Ct.rotateSpeed=.42;Ct.zoomSpeed=.55;Ct.update();var Ho=new Od(It);Ho.addPass(new Gd(Xe,vt));var Gg=new Fd({intensity:.62,luminanceThreshold:.8,luminanceSmoothing:.18,mipmapBlur:!0}),kg=new kd({hue:0,saturation:-.015}),Vg=new Hd({brightness:.06,contrast:.018}),Wg=new Wd({offset:.46,darkness:.24}),rp=new Vd({blendFunction:Be.OVERLAY,premultiply:!0});rp.blendMode.opacity.value=.012;var Xg=new zd;Ho.addPass(new Xd(vt,Gg,kg,Vg,Wg,rp,Xg));var Ys=!0,is=20261020;function at(){is|=0,is=is+1831565813|0;let n=Math.imul(is^is>>>15,1|is);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}var pt=(n,e)=>n+at()*(e-n),rn=Fn.clamp,ln=(n,e,t)=>{let i=rn((t-n)/(e-n),0,1);return i*i*(3-2*i)},Me=E,Ui=1/60,os=0,fi=(n,e,t,i)=>n+(e-n)*(1-Math.exp(-t*i)),eh=(n,e)=>{let t=(e-n+Math.PI)%(Math.PI*2);return t<0&&(t+=Math.PI*2),t-Math.PI},Yd=(n,e,t,i)=>n+eh(n,e)*(1-Math.exp(-t*i));function jd(n){let e=Math.sin(n*127.1+311.7)*43758.5453123;return e-Math.floor(e)}function Zc(n){let e=Math.floor(n),t=n-e,i=t*t*(3-2*t);return(jd(e)*(1-i)+jd(e+1)*i)*2-1}function Zt(n){return Zc(n)*.58+Zc(n*2.07+13.7)*.28+Zc(n*4.11+41.3)*.14}function Yg(n){let e=n>>>0;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var To={};function Kn(n,e=.045,t=.015,i=.004){return n.getHSL(To,Ae),new he().setHSL((To.h+(at()*2-1)*i+1)%1,rn(To.s+(at()*2-1)*t,0,1),rn(To.l+(at()*2-1)*e,.02,.98),Ae)}var rs=new Me,Vs=new Me,Ws=new Me,Zd=new Me;function ls(n,e){n.index&&(n=n.toNonIndexed());let t=n.attributes.position,i=new Float32Array(t.count*3);for(let r=0;r<t.count;r+=3){rs.fromBufferAttribute(t,r),Vs.fromBufferAttribute(t,r+1),Ws.fromBufferAttribute(t,r+2);let s=(rs.x+Vs.x+Ws.x)/3,a=(rs.y+Vs.y+Ws.y)/3,o=(rs.z+Vs.z+Ws.z)/3;Zd.subVectors(Vs,rs).cross(Ws.sub(rs)).normalize();let l=e(s,a,o,Zd);for(let c=0;c<3;c++)i[(r+c)*3]=l.r,i[(r+c)*3+1]=l.g,i[(r+c)*3+2]=l.b}return n.setAttribute("color",new Ut(i,3)),n.computeVertexNormals(),n}var qs=new lr({vertexColors:!0,flatShading:!0,roughness:.95,metalness:0}),rh=qs.clone();rh.side=jt;var mi=qs.clone();mi.emissive=new he(2759216);mi.emissiveIntensity=.14;var Ks=mi.clone();Ks.side=jt;var jg=new Xt({vertexColors:!0,side:jt,fog:!1,toneMapped:!0});function Ee(n,e,t={}){let i=new he(e),r=ls(n,()=>Kn(i,t.lightness??.045,t.saturation??.015,t.hue??.004)),s=t.figure?t.doubleSide?Ks:mi:t.doubleSide?rh:qs,a=new Je(r,s);return a.castShadow=t.castShadow??!0,a.receiveShadow=t.receiveShadow??!0,a}function Pe(n,e,t={}){return Ee(n,e,{...t,figure:!0})}function Qs(n,e,t={}){let i=ls(n,e),r=new Je(i,t.doubleSide?Ks:mi);return r.castShadow=t.castShadow??!0,r.receiveShadow=t.receiveShadow??!0,r}function Lo(n,e=8){let t=n.map(c=>{let h=[];for(let u=0;u<e;u++){let d=u/e*Math.PI*2;h.push(new Me(Math.cos(d)*c.w,c.y+Math.sin(d)*c.h,c.z))}return h}),i=[];for(let c=0;c<t.length-1;c++)for(let h=0;h<e;h++){let u=t[c][h],d=t[c][(h+1)%e],p=t[c+1][(h+1)%e],m=t[c+1][h];i.push(u.x,u.y,u.z,d.x,d.y,d.z,p.x,p.y,p.z),i.push(u.x,u.y,u.z,p.x,p.y,p.z,m.x,m.y,m.z)}let r=n[0],s=n[n.length-1],a=t[0],o=t[t.length-1];for(let c=0;c<e;c++){let h=a[c],u=a[(c+1)%e];i.push(0,r.y,r.z,u.x,u.y,u.z,h.x,h.y,h.z);let d=o[c],p=o[(c+1)%e];i.push(0,s.y,s.z,d.x,d.y,d.z,p.x,p.y,p.z)}let l=new tt;return l.setAttribute("position",new _e(i,3)),l.computeVertexNormals(),l}function Gt(n,e,t,i,r,s={}){let a=new Me().subVectors(e,n),o=a.length(),l=new nt(i,t,o,s.segments??5,1),c=Ee(l,r,s);return c.position.copy(n).addScaledVector(a,.5),c.quaternion.setFromUnitVectors(new Me(0,1,0),a.normalize()),c}var Bo=document.createElement("canvas");Bo.width=Bo.height=256;{let n=Bo.getContext("2d"),e=n.createRadialGradient(128,128,0,128,128,128);e.addColorStop(0,"rgba(255, 207, 136, 0.86)"),e.addColorStop(.22,"rgba(255, 160, 74, 0.55)"),e.addColorStop(.52,"rgba(255, 118, 48, 0.18)"),e.addColorStop(1,"rgba(255, 100, 40, 0)"),n.fillStyle=e,n.fillRect(0,0,256,256)}var sh=new Jr(Bo);sh.colorSpace=Ae;var zo=document.createElement("canvas");zo.width=96;zo.height=160;{let n=zo.getContext("2d"),e=n.createRadialGradient(48,118,3,48,118,108);e.addColorStop(0,"#fff3cf"),e.addColorStop(.25,"#ffd08a"),e.addColorStop(.5,"#ffab4c"),e.addColorStop(.76,"#e2711f"),e.addColorStop(1,"#a83d0d"),n.fillStyle=e,n.fillRect(0,0,96,160);let t=n.createLinearGradient(0,0,0,160);t.addColorStop(0,"rgba(45, 14, 4, 0.38)"),t.addColorStop(.35,"rgba(45, 14, 4, 0)"),t.addColorStop(1,"rgba(255, 206, 130, 0.18)"),n.fillStyle=t,n.fillRect(0,0,96,160)}var sp=new Jr(zo);sp.colorSpace=Ae;function ah(n,e){let t=new Xt({map:sh,transparent:!0,opacity:e,blending:Pc,depthWrite:!1,toneMapped:!1}),i=new Je(new hi(n,n),t);return i.rotation.x=-Math.PI/2,i.renderOrder=3,i}var Uo=document.createElement("canvas");Uo.width=Uo.height=128;{let n=Uo.getContext("2d"),e=n.createRadialGradient(64,64,2,64,64,64);e.addColorStop(0,"rgba(14, 8, 20, 0.72)"),e.addColorStop(.45,"rgba(14, 8, 20, 0.44)"),e.addColorStop(.78,"rgba(14, 8, 20, 0.13)"),e.addColorStop(1,"rgba(14, 8, 20, 0)"),n.fillStyle=e,n.fillRect(0,0,128,128)}var ap=new Jr(Uo);ap.colorSpace=Ae;function cs(n,e,t=.5){let i=new Xt({map:ap,transparent:!0,opacity:t,depthWrite:!1,toneMapped:!1}),r=new Je(new hi(n,e),i);return r.rotation.x=-Math.PI/2,r.position.y=.014,r.renderOrder=2,r.castShadow=!1,r.receiveShadow=!1,r}var Zg=new Rn(800,40,20),Qg=new Me(-.62,.2,-.76).normalize(),qg=new He({side:Tt,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new he(4928871)},uMid:{value:new he(11690874)},uHorizon:{value:new he(16751480)},uSunColor:{value:new he(16765856)},uSunDir:{value:Qg.clone()}},vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vDir;
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        void main() {
          vec3 dir = normalize(vDir);
          float h = clamp(dir.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.12, h));
          col = mix(col, uTop, smoothstep(0.07, 0.34, h));
          float sd = max(dot(dir, normalize(uSunDir)), 0.0);
          col += uSunColor * (pow(sd, 220.0) * 1.05 + pow(sd, 26.0) * 0.28 + pow(sd, 5.0) * 0.10 + pow(sd, 2.0) * 0.04);
          float band = exp(-pow((h - 0.022) * 13.0, 2.0));
          col += uSunColor * band * 0.14;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `}),op=new Je(Zg,qg);op.renderOrder=-10;Xe.add(op);Xe.add(new go(10984416,4865890,1.08));var cn=new cr(16765608,3.25);cn.position.set(-92,36,-118);cn.target.position.set(0,0,-4);cn.castShadow=!0;cn.shadow.mapSize.set(2048,2048);cn.shadow.camera.left=-96;cn.shadow.camera.right=96;cn.shadow.camera.top=96;cn.shadow.camera.bottom=-96;cn.shadow.camera.near=8;cn.shadow.camera.far=340;cn.shadow.bias=-5e-4;cn.shadow.normalBias=.04;cn.shadow.radius=3;Xe.add(cn,cn.target);var lp=new cr(11781106,1.2);lp.position.set(20,30,80);Xe.add(lp);var Go=new cr(12110325,1.75);Go.position.set(14,18,24);Go.castShadow=!1;Go.layers.set(1);Xe.add(Go);vt.layers.enable(1);var No=new cr(16748408,.85);No.position.set(-70,11,-120);No.target.position.set(0,1.2,-4);Xe.add(No,No.target);function ht(n,e){let t=0;t+=1.15*Math.sin(n*.055+.7)*Math.cos(e*.042+.9),t+=.55*Math.sin(n*.14+e*.07+1.9),t+=.32*Math.cos(n*.23-e*.11+.3),t+=ln(4,27,e)*(1.5+.9*Math.sin(n*.13+.5)+.5*Math.cos(n*.055-1.2)),t+=ln(20,115,-e)*(2.2+1.6*Math.sin(n*.045+1.2)+1.1*Math.cos(n*.09-.7));let i=(o,l,c,h)=>h*Math.exp(-(((n-o)**2+(e-l)**2)/(c*c))*2.2);t+=i(-6.5,11.5,6.5,1.2)+i(9.5,13,7.5,1.55)+i(-16,16,8,1.2)+i(2.5,6.5,3.8,.75)+i(-2.5,9.5,4.5,.65)+i(5.5,8.5,3.5,.5),t+=i(-30,-32,18,1.6)+i(22,-38,20,2)+i(-4,-52,22,1.8)+i(62,-58,25,2.2);let r=Math.hypot(n/22,(e+2)/16),s=1-ln(.45,1,r);t*=1-.96*s;let a=ln(3,4.6,e)*(1-ln(10.5,14.5,e));if(a>.001){let o=.62*Math.sin(n*.58+e*.42+1.1)+.42*Math.cos(n*.9-e*.55+.4)+.24*Math.sin(n*1.55+e*1.1)+.7*Math.exp(-(((n+3.5)**2+(e-7.2)**2)/18))+.5*Math.exp(-(((n-5)**2+(e-8.8)**2)/22))+.4*Math.exp(-(((n+9)**2+(e-10.5)**2)/30))+.75*Math.exp(-(((n-.5)**2+(e-6.2)**2)/12))+.55*Math.exp(-(((n+2)**2+(e-8.8)**2)/18))+.6*Math.exp(-(((n-4)**2+(e-5.4)**2)/10))+.16*Math.sin(n*2.7+e*2.1);t+=a*o}return t}var cp=new Me(-.62,.35,-.7).normalize(),Kg=new he(16308432),bo=new he(15721193),Jg=new he(12101583),Qc=new he(8089503),$g=new he(6379130),ev=(n,e,t,i)=>{let r=Math.sin(n*.07+Math.sin(t*.045)*1.9)*.5+.5,s=(r>.54?bo:r>.22?Jg:Qc).clone();i.y<.8&&s.lerp($g,.46);let a=i.dot(cp);return a<.12?s.lerp(Qc,.48):a>.68&&s.lerp(bo,.28),i.y>.82&&s.lerp(Kg,.16*ln(.2,1,a)),e>1.5&&s.lerp(bo,.32),at()>.88&&s.lerp(bo,.35),at()>.94&&s.lerp(Qc,.42),Kn(s,.085,.03,.005)},qc=1374772973,Qd=()=>(qc=qc*1664525+1013904223>>>0,qc/4294967296),ko=new hi(380,340,220,200);ko.rotateX(-Math.PI/2);ko.translate(0,0,-80);var ss=ko.attributes.position;for(let n=0;n<ss.count;n++){let e=ss.getX(n),t=ss.getZ(n),i=Math.abs(e)>186||t<-246||t>86,r=Math.abs(e)<14&&t>-17&&t<13;!i&&!r&&(e+=Qd()-.5,t+=Qd()-.5,ss.setX(n,e),ss.setZ(n,t)),ss.setY(n,ht(e,t))}var oh=new Je(ls(ko,ev),qs);oh.receiveShadow=!0;oh.castShadow=!1;Xe.add(oh);function tv(n,e,t){let i=t+1.4*Math.sin(n*.043+.7);for(let r of e){let s=Math.abs(n-r.x);s<r.w&&(i=Math.max(i,r.h*(1-s/r.w)))}return i}function Js({cx:n,cz:e,width:t,depth:i,peaks:r,base:s=4,segX:a=36,segZ:o=12,ridgeT:l=.63,baseColor:c,snowColor:h,snowLine:u=.55,maxH:d,rough:p=1}){let m=new hi(t,i,a,o);m.rotateX(-Math.PI/2);let x=m.attributes.position;for(let M=0;M<x.count;M++){let P=x.getX(M),R=x.getZ(M),I=n+P,N=(R+i/2)/i,C=N>l?(1-N)/(1-l):N/l,z=Math.pow(rn(C,0,1),.92),O=tv(I,r,s);O*=1+.05*Math.sin(I*.19+R*.35)+.035*Math.cos(I*.07-R*.23);let q=O*z;q+=(Math.sin(I*.16+R*.31)*.85+Math.cos(I*.31-R*.19)*.55)*z*p,x.setY(M,q)}m.translate(n,0,e);let f=new he(c),y=new he(h),v=new he(7301014),g=new he(12103896),w=new he(16770264),b=ls(m,(M,P,R,I)=>{let N=P>d*(u+(at()-.5)*.2)&&I.y>-.05,C=(N?y:f).clone(),z=I.dot(cp);N?z<.12?C.lerp(g,.22):C.lerp(w,.07):z<.28?C.lerp(v,.24):z>.62&&C.lerp(w,.1);let O=Math.sin(M*.19+P*.33+R*.11)+Math.sin(M*.06-P*.21+R*.07);return N&&I.z>.42&&C.lerp(g,.2),N&&I.y<.58&&O>1&&C.lerp(f,.55),N&&I.y>.78&&O<-1.15&&C.lerp(w,.16),Kn(C,N?.075:.09,.02,.005)}),_=new Je(b,qs);return _.castShadow=!1,_.receiveShadow=!1,Xe.add(_),_}Js({cx:-82,cz:-142,width:260,depth:140,base:5,peaks:[{x:-150,h:22,w:52},{x:-112,h:31,w:56},{x:-68,h:40,w:54},{x:-28,h:27,w:44},{x:8,h:16,w:32}],segX:64,segZ:20,ridgeT:.66,baseColor:"#897da8",snowColor:"#fbf8ff",snowLine:.24,maxH:40,rough:1.35});Js({cx:0,cz:-230,width:500,depth:130,base:4,peaks:[{x:-220,h:13,w:70},{x:-150,h:17,w:60},{x:-80,h:14,w:60},{x:-10,h:19,w:58},{x:60,h:22,w:60},{x:130,h:16,w:62},{x:200,h:20,w:66},{x:265,h:13,w:60}],segX:68,segZ:14,baseColor:"#a79ac7",snowColor:"#f6f1fc",snowLine:.44,maxH:24,rough:1.1});Js({cx:0,cz:-300,width:580,depth:110,base:3,peaks:[{x:-240,h:11,w:80},{x:-150,h:15,w:78},{x:-50,h:12,w:70},{x:50,h:16,w:78},{x:150,h:13,w:78},{x:240,h:11,w:80}],segX:54,segZ:10,baseColor:"#b9aed3",snowColor:"#fbf8fe",snowLine:.48,maxH:20,rough:.8});Js({cx:-112,cz:-105,width:190,depth:70,base:1,peaks:[{x:-178,h:6,w:45},{x:-132,h:12,w:48},{x:-82,h:9,w:42}],segX:26,segZ:8,baseColor:"#a79ac7",snowColor:"#eee9f7",snowLine:.1,maxH:13,rough:.7});Js({cx:118,cz:-122,width:200,depth:76,base:1,peaks:[{x:58,h:6,w:46},{x:106,h:10,w:48},{x:154,h:7,w:44}],segX:26,segZ:8,baseColor:"#afa3ca",snowColor:"#f1edf9",snowLine:.06,maxH:10,rough:.58});function Kc(n,e,t,i="#c9767c"){let r=9+Math.floor(at()*4),s=new ui;for(let d=0;d<r;d++){let p=d/r*Math.PI*2,m=Math.cos(p)*n*.5*(.62+at()*.38),x=Math.sin(p)*e*.5*(.3+at()*.7)+Math.sin(p*3+.7)*e*.055;d===0?s.moveTo(m,x):s.lineTo(m,x)}s.closePath();let a=new Ri(s),o=new he(t),l=new he(i),c=o.clone().multiplyScalar(.66),h=ls(a,(d,p,m,x)=>{let f=rn(p/e+.5,0,1),y=o.clone().lerp(c,(1-f)*.4);return y.lerp(l,rn(-d/(n*.5),0,1)*.16+(1-f)*.16),Kn(y,.04,.016,.004)}),u=new Je(h,jg);return u.castShadow=!1,u.receiveShadow=!1,u}var hp=[];function Jn(n,e,t,i,r,s,a,o,l="#dc8c86"){let c=new Ce,h=Kc(i,s,a,l),u=Kc(i*.68,s*.62,o);u.position.set(i*.07,-s*.38,-Math.max(1.5,r*.04));let d=Kc(i*.52,s*.42,"#b96a72","#d58a80");d.position.set(-i*.15,s*.22,-Math.max(1.2,r*.03)),c.add(h,u,d),c.position.set(n,e,t),c.rotation.z=pt(-.02,.02),c.rotation.y=pt(-.05,.05),c.userData.baseX=n,c.userData.phase=at()*6.28,Xe.add(c),hp.push(c)}Jn(-190,84,-330,235,70,26,"#6f3b55","#592e46","#c07078");Jn(-20,104,-356,310,88,34,"#7a405a","#5f3048","#c9797e");Jn(160,88,-342,245,72,26,"#7f425c","#632f4a","#cf7e82");Jn(60,62,-310,200,55,18,"#9a4f66","#7a3c53","#dd8e86");Jn(-105,58,-305,170,50,16,"#8a465f","#6d344c","#cc7b7d");Jn(230,60,-334,180,52,17,"#8f4a62","#71364f","#c9797e");Jn(-10,38,-286,220,46,10,"#b15f6d","#8c4759","#e7a08f");Jn(115,35,-288,150,40,9,"#bb6a72","#944f60","#efad98");Jn(-115,74,-336,170,62,42,"#733d57","#5a2f47","#c4747b");Jn(95,94,-352,190,68,46,"#7b405a","#5f3048","#c9797e");var up=[],Er=new Ce;function nv(){let n=new Ce,e=new Xt({color:4863061,side:jt,fog:!1}),t=new tt;t.setAttribute("position",new _e([0,0,0,-1,.04,.16,-.16,0,-.22],3));let i=new Je(t,e),r=new Je(t,e);return r.scale.x=-1,n.add(i,r),n.userData.left=i,n.userData.right=r,n.userData.phase=at()*6.28,n}for(let n=0;n<7;n++){let e=nv(),t=Math.ceil(n/2),i=n%2===0?1:-1;e.position.set(t*1.5+1.2,Math.abs(i*t)*.22,i*t*1.3+n%2*.4),e.scale.setScalar(1.8),Er.add(e),up.push(e)}Er.position.set(-55,24,-90);Xe.add(Er);var dp=[],pp=[],iv=new rt(.09,0);function rv(n,e,t=8,i=.85){for(let r=0;r<t;r++){let s=new Xt({color:10655405,transparent:!0,opacity:.24,depthWrite:!1,fog:!0}),a=new Je(iv,s);a.position.copy(e),a.userData={base:e.clone(),phase:at(),speed:pt(.045,.075),drift:pt(-.35,.35),size:pt(.7,1.25)*i},a.castShadow=!1,n.add(a),dp.push(a)}}function sv(n,e,t,i,r){let s=[];for(let l=0;l<t;l++){let c=l/t*Math.PI*2;s.push({x:Math.cos(c)*n,z:Math.sin(c)*n,drop:pt(i,r)})}let a=[];for(let l=0;l<t;l++){let c=s[l],h=s[(l+1)%t],u=(c.x+h.x)/2,d=(c.z+h.z)/2,p=e-(c.drop+h.drop)/2;a.push(c.x,e,c.z,h.x,e,h.z,u,p,d)}let o=new tt;return o.setAttribute("position",new _e(a,3)),Ee(o,"#E6E0F0",{doubleSide:!0,lightness:.035,castShadow:!1})}function av(n=1,e={}){let{ornament:t="#2a4da0",doorWood:i="#8a5a33",detail:r=!1,smokeCount:s=8}=e,a=new Ce,o=2.55,l=1.92,c=1.5,h=o*1.16,u=l-.03,d=te=>u+c*(1-te/h),p=Ee(new nt(o,o*1.03,l,14,1,!0),"#AEA7A1",{lightness:.045});p.position.y=l/2,a.add(p);let m=Ee(new Yt(o*1.015,.055,4,18),"#5F4935",{lightness:.025});m.rotation.x=Math.PI/2,m.position.y=.14,m.castShadow=!1,a.add(m);for(let te of[.55,1.12,1.7]){let A=Ee(new Yt(o*1.008,.032,3,22),"#8A7A68",{lightness:.04});A.rotation.x=Math.PI/2,A.position.y=te,A.castShadow=!1,a.add(A)}for(let te=0;te<14;te++){let A=te/14*Math.PI*2,S=Ee(new nt(.017,.017,l-.18,3),"#6E5B49",{lightness:.02,castShadow:!1});S.position.set(Math.cos(A)*o*1.004,l/2,Math.sin(A)*o*1.004),a.add(S)}let x=Ee(new rt(.075,0),"#8A7A68",{lightness:.04,castShadow:!1});x.position.set(.82,1.12,o*.82),a.add(x);let f=Ee(new nt(.018,.038,.27,4),r?"#C9A45E":"#9A8466",{lightness:.03,castShadow:!1});f.position.set(.82,.955,o*.83),f.rotation.z=.05,a.add(f);let y=Ee(new Yt(o*1.1,.055,4,18),"#6B4A33",{lightness:.025});y.rotation.x=Math.PI/2,y.position.y=l-.01,y.castShadow=!1,a.add(y);let v=Ee(new Yt(o*1.012,.045,3,22),"#8B5A33",{lightness:.03});v.rotation.x=Math.PI/2,v.position.y=l-.13,v.castShadow=!1,a.add(v);for(let te=0;te<12;te++){let A=te/12*Math.PI*2,S=Ee(new we(.075,.075,.018),te%2?"#A5433A":t,{lightness:.02,castShadow:!1});S.position.set(Math.cos(A)*o*1.018,l-.13,Math.sin(A)*o*1.018),S.rotation.y=Math.PI/2-A,S.rotation.z=Math.PI/4,a.add(S)}let g=Ee(new yt(h,c,14,2,!0),"#E9E4F1",{lightness:.035});g.position.y=l+c/2-.03,a.add(g),a.add(sv(h*.995,l+.02,20,.055,.15));for(let te=0;te<12;te++){let A=te/12*Math.PI*2,S=h*.62,G=[new Me(Math.cos(A)*h*1.005,l-.12,Math.sin(A)*h*1.005),new Me(Math.cos(A)*h*.995,d(h)+.02,Math.sin(A)*h*.995),new Me(Math.cos(A)*S,d(S)+.02,Math.sin(A)*S),new Me(Math.cos(A)*.56,d(.56)+.015,Math.sin(A)*.56)],ee=new Ci(G),L=Ee(new or(ee,8,.017,3,!1),"#5E4C3F",{lightness:.02,castShadow:!1});a.add(L)}let w=Ee(new nt(.44,.52,.14,10),"#6B4A33",{lightness:.04});w.position.y=l+c-.08,a.add(w);let b=Ee(new Yt(.5,.035,3,10),"#8B5A33",{lightness:.035,castShadow:!1});b.rotation.x=Math.PI/2,b.position.y=l+c-.14,a.add(b);let _=Ee(new nt(.37,.37,.02,10),"#1D1714",{lightness:.01,castShadow:!1});_.position.y=l+c-.005,a.add(_);let M=Ee(new nt(.1,.12,1,8),"#2E2833",{lightness:.02});M.position.set(.55,l+c+.28,.22),a.add(M);let P=Ee(new nt(.17,.21,.08,8),"#3A3340",{lightness:.02,castShadow:!1});P.position.set(.55,d(.592)+.05,.22),a.add(P);let R=Ee(new yt(.22,.18,8),"#25202B",{lightness:.015});R.position.set(.55,l+c+.82,.22),a.add(R);let I=Ee(new we(1.18,1.5,.13),"#3A2A20",{lightness:.02});I.position.set(0,.76,o-.03),a.add(I);let N=new Xt({map:sp,toneMapped:!1}),C=new Je(new we(.86,1.28,.07),N);C.position.set(0,.72,o+.04),a.add(C);let z=Ee(new we(.16,1.24,.08),"#5C3A22",{lightness:.03});z.position.set(-.3,.72,o+.13),a.add(z),a.userData.doorLeaf=z;let O={lightness:.03},q=Ee(new we(1.34,.16,.2),i,O);q.position.set(0,1.53,o+.03),a.add(q);let le=Ee(new we(1.34,.1,.24),"#6E4729",O);le.position.set(0,.05,o+.08),a.add(le);for(let te of[-.58,.58]){let A=Ee(new we(.14,1.58,.2),i,O);A.position.set(te,.8,o+.04),a.add(A);let S=Ee(new we(.05,.12,.07),"#3A2B1E",{lightness:.02,castShadow:!1});S.position.set(-.56,te<0?.45:1.15,o+.15),a.add(S)}let J=Ee(new we(1.15,.075,.22),t,{lightness:.03,castShadow:!1});J.position.set(0,1.62,o+.04),a.add(J);for(let te of[-.34,0,.34]){let A=Ee(new we(.1,.1,.02),te===0?"#C9A45E":"#A5433A",{lightness:.02,castShadow:!1});A.position.set(te,1.62,o+.16),A.rotation.z=Math.PI/4,a.add(A)}if(r){let te=Ee(new we(.035,.16,.035),"#C9A45E",{lightness:.03,castShadow:!1});te.position.set(.1,.78,o+.19),a.add(te);for(let A of[-.35,.35]){let S=Ee(new we(.07,.07,.02),"#2A4DA0",{lightness:.025,castShadow:!1});S.position.set(A,1.32,o+.19),S.rotation.z=Math.PI/4,a.add(S)}}let Z=Ee(new we(1.42,.11,.5),"#6B4A33",{lightness:.03});Z.position.set(0,.055,o+.36),a.add(Z);for(let te of[-.4,.35]){let A=Ee(new rt(.16,0),"#D8D2E8",{lightness:.03,castShadow:!1});A.scale.set(1.3,.3,.8),A.position.set(te,.115,o+.48),a.add(A)}let $=new zs(16747072,6,10,2);$.position.set(0,.95,o+.65),a.add($),pp.push($);let U=ah(4.2,.22);U.position.set(0,.045,o+1.35),a.add(U);for(let te=0;te<12;te++){let A=te/12*Math.PI*2,S=Ee(new rt(pt(.5,.75),0),"#C9C2E2",{lightness:.035});S.scale.set(1.75,.3,1.05),S.position.set(Math.cos(A)*o*1.02,.08,Math.sin(A)*o*1.02),S.rotation.y=at()*Math.PI,S.castShadow=!1,a.add(S)}let V=cs(o*2.9,o*2.9,.34);return V.position.y=.008,a.add(V),a.scale.setScalar(n),rv(a,new Me(.55,l+c+.95,.22),s,r?1:.8),a.userData.roofHeight=(l+c)*n,a}function lh(n,e,t,i,r={}){let s=av(i,r);return s.position.set(n,ht(n,e),e),s.rotation.y=t,Xe.add(s),s}var ov=lh(.8,-6.3,-.42,1.2,{ornament:"#2A4DA0",doorWood:"#8A5A33",detail:!0,smokeCount:9}),GE=lh(-6.5,-12.2,.46,.9,{ornament:"#8E3A33",doorWood:"#6F4A2E",detail:!1,smokeCount:7}),kE=lh(14.8,-17.5,-.78,.76,{ornament:"#2E6F7A",doorWood:"#7D5A3A",detail:!1,smokeCount:6});function lv(n){let e=Dd(n);e.traverse(r=>{r.isMesh&&r.layers.enable(1)});let t=e.userData.parts,i=cs(n.pose==="standing"?1.25:1.65,n.pose==="standing"?.95:1.3,.64);return i.position.z=.1,e.add(i),t.standShadow=i,t.seatedGroup.visible=!1,t.standGroup.visible=!0,e}var st=new Me(-1.2,ht(-1.2,1.2),1.2),cv=[{pose:"seatTalk",seat:"stump",x:-3.35,z:0,coat:"#203A55",accent:"#986A2E",trim:"#A97A36",fur:"#6B523D",hatType:"fur",hatColor:"#5C3829",skin:"#96704F",beard:"full",beardColor:"#5A514A",expression:"sing",headTurn:-.15,headPitch:-.12,tilt:.035,lean:.08,height:1.22,pattern:!0,age:1},{pose:"seatListen",seat:"stone",x:-1.45,z:-1.45,coat:"#5E2E2B",accent:"#2E8F7C",trim:"#E3D2A4",fur:"#8B7557",hatType:"peaked",hatColor:"#3A2A25",skin:"#997254",beard:"mustache",beardColor:"#4a3a30",expression:"smile",headTurn:-.8,headPitch:.01,tilt:-.03,lean:.055,height:1.23},{pose:"seatTea",legs:"crossed",x:.85,z:-.25,coat:"#48542F",accent:"#A13A32",trim:"#B9A77E",fur:"#C9B79C",hatType:"cap",hatColor:"#4A3B2D",skin:"#A17858",beard:"none",expression:"tea",earring:!0,beads:!0,headTurn:.05,headPitch:.16,tilt:-.03,lean:.03,height:1.19},{pose:"seatWarm",seat:"stump",x:-2.4,z:2.5,coat:"#3F556E",accent:"#E3D2A4",trim:"#C9D6E4",fur:"#6B523D",hatType:"fur",hatColor:"#4A3528",skin:"#976F51",beard:"short",beardColor:"#4a3a30",expression:"warm",headTurn:-.8,headPitch:.04,tilt:.015,lean:.05,height:1.14}];function hv(n,e,t){if(!n)return;let i=ht(e,t);if(n==="stump"){let r=Ee(new nt(.23,.27,.26,7),"#6a4a32",{lightness:.05});r.position.set(e,i+.13,t),Xe.add(r);let s=Ee(new nt(.225,.225,.022,7),"#8a6647",{lightness:.04,castShadow:!1});s.position.set(e,i+.266,t),Xe.add(s)}else if(n==="stone"){let r=Ee(new sr(.32,0),"#6b6478",{lightness:.05});r.scale.set(1.2,.35,.9),r.position.set(e,i+.11,t),Xe.add(r)}}var sn=[];cv.forEach(n=>{let e=lv(n);e.position.set(n.x,ht(n.x,n.z),n.z),e.rotation.y=Math.atan2(st.x-n.x,st.z-n.z),Xe.add(e);let t=e.userData.parts;t.basePos=new Me(n.x,ht(n.x,n.z),n.z),t.baseYaw=e.rotation.y,t.targetYaw=e.rotation.y,t.prevX=e.position.x,t.prevZ=e.position.z,hv(n.seat,n.x,n.z),sn.push(e)});var $s=new Ce,fp=Ee(new nt(.07,.075,.8,5),"#5a3a22",{lightness:.04});fp.rotation.z=Math.PI/2;$s.add(fp);$s.position.set(0,.02,.34);$s.visible=!1;sn[3].userData.parts.upper.add($s);sn[3].userData.parts.carryLog=$s;var $n=new Ce;$n.position.copy(st);$n.scale.setScalar(1.12);Xe.add($n);for(let n=0;n<10;n++){let e=n/10*Math.PI*2+at()*.2,t=Ee(new sr(pt(.16,.26),0),"#5b556c",{lightness:.05});t.scale.set(1.25,.72,1),t.position.set(Math.cos(e)*.78,.1,Math.sin(e)*.78),t.rotation.set(at(),at()*3,at()),$n.add(t)}for(let n=0;n<5;n++){let e=n/5*Math.PI*2+.4,t=Ee(new nt(.07,.09,1.15,5),"#4a3220",{lightness:.05});t.rotation.z=Math.PI/2,t.rotation.y=e,t.position.set(0,.2+n*.055,0),$n.add(t)}var uv=[new Xt({color:15226388,side:jt,transparent:!0,opacity:.96,depthWrite:!1,toneMapped:!1}),new Xt({color:16750633,side:jt,transparent:!0,opacity:.94,depthWrite:!1,toneMapped:!1}),new Xt({color:16760926,side:jt,transparent:!0,opacity:.92,depthWrite:!1,toneMapped:!1})];function dv(n){let e=new ui;e.moveTo(0,0),e.lineTo(-.22,.16),e.lineTo(-.3,.58),e.lineTo(-.1,.4),e.lineTo(.02,.96),e.lineTo(.13,.4),e.lineTo(.3,.6),e.lineTo(.21,.16),e.lineTo(0,0);let t=new Ri(e);return t.scale(n,n,1),t}var mp=[],pv=[{scale:1.05,mat:0,planes:3,turn:0},{scale:.72,mat:1,planes:2,turn:.4},{scale:.42,mat:2,planes:2,turn:.9}];pv.forEach((n,e)=>{let t=dv(n.scale);for(let i=0;i<n.planes;i++){let r=new Je(t,uv[n.mat]),s=i/n.planes*Math.PI+n.turn;r.position.set(0,.02+e*.015,0),r.rotation.y=s,r.renderOrder=2+e,r.userData={phase:at()*6.28,baseRotY:s},r.castShadow=!1,$n.add(r),mp.push(r)}});var Vo=new ao(new Is({map:sh,color:16753754,transparent:!0,opacity:.4,blending:Pc,depthWrite:!1,toneMapped:!1}));Vo.position.set(0,.8,0);Vo.scale.set(4.4,4.4,1);$n.add(Vo);var js=new zs(16751164,7,13,2);js.position.set(0,.95,0);$n.add(js);var gp=ah(6.5,.18);gp.position.set(0,.055,0);$n.add(gp);var ch=ah(3.5,.18);ch.position.set(0,.07,0);$n.add(ch);var vp=[];function Oi(n,e,t,i=1,r=!1){let s=new Ce,a="#E5DCC8",o=r?"#6A5748":"#D8CDB6",l=r?"#5A4A3E":"#C9BCA3",c=r?"#4E4037":"#B8AA92",h=Ee(new rt(.55,1),a,{lightness:.03});h.scale.set(1.1,.95,1.35),h.position.y=.72,s.add(h),[[.22,.95,.18,.3],[-.24,.93,-.16,.32],[.04,1.02,-.36,.26]].forEach(([v,g,w,b])=>{let _=Ee(new rt(b,1),"#EEE6D3",{lightness:.028});_.position.set(v,g,w),s.add(_)});let d=new Ce;d.position.set(0,.93,.66),d.rotation.z=pt(-.1,.1),d.rotation.y=pt(-.08,.08),s.add(d);let p=Ee(new rt(.19,1),o,{lightness:.03});p.scale.set(.95,1,1.05),d.add(p);let m=Ee(new yt(.1,.22,4),l,{lightness:.02});m.rotation.x=Math.PI/2,m.position.set(0,-.03,.17),d.add(m);let x=[];for(let v of[-1,1]){let g=Ee(new yt(.045,.14,4),c,{lightness:.02,castShadow:!1});g.rotation.z=v*.95,g.position.set(v*.17,.055,0),d.add(g),x.push(g);let w=new Je(new rt(.017,0),new Xt({color:2760987}));w.position.set(v*.07,.03,.155),d.add(w)}for(let v of[-.26,.26])for(let g of[-.34,.36]){let w=new Me(v*1.02,.3,g);s.add(Gt(new Me(v,.52,g),w,.05,.04,"#453A2F",{lightness:.025,figure:!0,segments:4}));let b=new Me(v*1.05,.09,g+.01);s.add(Gt(w,b,.035,.028,"#3A3028",{lightness:.02,figure:!0,segments:4}));let _=Ee(new we(.07,.055,.09),"#2A211A",{lightness:.015});_.position.set(v*1.05,.035,g+.01),s.add(_)}let f=Ee(new rt(.1,0),a,{lightness:.02});f.position.set(0,.72,-.74),s.add(f);let y=cs(1.5,1.15,.38);return y.position.z=.05,s.add(y),s.userData.rig={head:d,tail:f,body:h,ears:x,baseHeadX:d.rotation.x,baseHeadY:d.rotation.y,baseHeadZ:d.rotation.z,baseEarZ:x.map(v=>v.rotation.z),baseBodyScale:h.scale.clone(),isLamb:i<.7,baseY:ht(n,e),phase:at()*6.28},s.position.set(n,ht(n,e),e),s.rotation.y=t,s.scale.setScalar(i),Xe.add(s),vp.push(s),s}Oi(-5.9,-3.4,.6,1.08);Oi(-7.1,-2.2,-.3,1.03);Oi(-6.3,-5,1.9,.95);Oi(-7.7,-4,.1,.86);Oi(-7.8,-2.4,1.1,.97);Oi(-5.1,-5.2,-.5,.89);Oi(-7.3,-4.8,-1.3,.95,!0);Oi(-4.6,-2.9,.4,.63);function fv(n,e,t,i=1){let r=new Ce,s=new he("#E6DFD0"),a=new he("#8B6242"),o="#4A3C2E",l=Qs(Lo([{z:-.5,y:.63,w:.24,h:.25},{z:-.15,y:.64,w:.32,h:.3},{z:.2,y:.65,w:.33,h:.32},{z:.45,y:.66,w:.27,h:.3}],7),(f,y,v,g)=>{let b=v>.1&&y>.62||f<-.12&&v<.15&&y>.72?a.clone():s.clone();return g.y<-.15&&(b=b.lerp(new he("#C9BEAA"),.2)),Kn(b,.045,.016,.004)});r.add(l);let c=Gt(new Me(0,.72,.32),new Me(0,.96,.58),.13,.095,"#8B6242",{lightness:.04,figure:!0,segments:5});r.add(c);let h=Pe(new rt(.16,1),"#8B6242",{lightness:.04});h.scale.set(.9,.95,1.2),h.position.set(0,1,.66),r.add(h);let u=Pe(new yt(.075,.2,4),"#A37E58",{lightness:.03});u.rotation.x=Math.PI/2,u.position.set(0,.96,.8),r.add(u);let d=[];for(let f of[-1,1]){let y=Pe(new yt(.045,.16,4),"#8B6242",{lightness:.03,castShadow:!1});y.rotation.z=f*1.05,y.position.set(f*.14,1.09,.64),r.add(y),d.push(y);let v=Pe(new we(.035,.02,.012),"#241A15",{lightness:.008,castShadow:!1});v.position.set(f*.065,1.02,.79),r.add(v);let g=[[.08,1.1,.64],[.13,1.22,.57],[.15,1.33,.47],[.12,1.41,.36],[.06,1.43,.26]];for(let w=0;w<g.length-1;w++){let b=w/(g.length-1),_=new Me(f*g[w][0],g[w][1],g[w][2]),M=new Me(f*g[w+1][0],g[w+1][1],g[w+1][2]),P=new he("#6B5A48").lerp(new he("#B5A184"),b*.8),R=Gt(_,M,.03*(1-b*.55),.03*(1-(b+.25)*.55),P,{lightness:.02,figure:!0,segments:4,castShadow:!1});r.add(R)}}let p=Pe(new yt(.055,.19,4),"#6B5A48",{lightness:.03,castShadow:!1});p.rotation.x=Math.PI,p.position.set(0,.83,.74),r.add(p);for(let f of[-.2,.2])for(let y of[-.3,.28]){let v=new Me(f*1.05,.3,y);r.add(Gt(new Me(f,.5,y),v,.045,.035,o,{lightness:.025,figure:!0,segments:4}));let g=new Me(f*1.1,.07,y+.02);r.add(Gt(v,g,.032,.025,o,{lightness:.02,figure:!0,segments:4}));let w=Pe(new we(.07,.055,.09),"#2A211A",{lightness:.015});w.position.set(f*1.1,.035,y+.02),r.add(w)}let m=Pe(new yt(.055,.18,4),"#E6DFD0",{lightness:.03});m.rotation.x=-.9,m.position.set(0,.8,-.52),r.add(m);let x=cs(1.15,.95,.34);return x.position.z=.06,r.add(x),r.userData.rig={body:l,tail:m,ears:d,baseTailZ:m.rotation.z,baseEarZ:d.map(f=>f.rotation.z),baseBodyScale:l.scale.clone(),phase:at()*6.28},r.position.set(n,ht(n,e),e),r.rotation.y=t,r.scale.setScalar(i),Xe.add(r),r}var mv=fv(-5.2,-1.6,.3,1);function gv(n,e,t,i=1){let r=new Ce,s=new he("#4C3E4A"),a=new he("#7A6874"),o=new he("#2A232C"),l=new he("#B06A7A"),c=new he("#4A3C3A"),h=new he("#D8C9A8"),u=Qs(Lo([{z:-.98,y:1.02,w:.5,h:.42},{z:-.55,y:1.03,w:.63,h:.5},{z:-.05,y:1.03,w:.67,h:.55},{z:.45,y:1.06,w:.6,h:.53},{z:.72,y:1.09,w:.52,h:.5}],7),(N,C,z,O)=>{let q=s.clone();return O.y>.2&&(q=q.lerp(a,.55)),O.y<-.18&&(q=q.lerp(o,.25)),O.x<-.35&&O.y>-.1&&(q=q.lerp(l,.2)),Kn(q,.055,.016,.004)});r.add(u);let d=Pe(new rt(.48,0),"#6A5A66",{lightness:.06});d.scale.set(1.08,.62,.95),d.position.set(0,1.7,.22),r.add(d);let p=Pe(new rt(.4,0),"#5E4E5A",{lightness:.05});p.scale.set(.9,.45,.85),p.position.set(0,1.64,-.25),r.add(p);let m=Gt(new Me(0,1.35,.55),new Me(0,.96,1.12),.36,.3,"#5A4A56",{lightness:.05,figure:!0,segments:6});r.add(m);let x=Pe(new rt(.3,0),"#5E4E5A",{lightness:.055});x.scale.set(1.05,.82,1.15),x.position.set(0,.88,1.3),r.add(x);let f=Pe(new rt(.22,0),"#7A6A76",{lightness:.05,castShadow:!1});f.scale.set(1.05,.55,.75),f.position.set(0,.99,1.22),r.add(f);let y=Pe(new we(.32,.22,.3),"#6A5A62",{lightness:.055});y.position.set(0,.78,1.51),r.add(y);let v=Pe(new we(.18,.08,.02),"#8F7F88",{lightness:.045,castShadow:!1});v.position.set(0,.81,1.67),r.add(v);let g=Pe(new yt(.09,.24,4),"#4F404A",{lightness:.04,castShadow:!1});g.rotation.x=Math.PI,g.position.set(0,.64,1.42),r.add(g);let w=[];for(let N of[-1,1]){let C=Pe(new we(.045,.035,.02),"#221B20",{lightness:.01,castShadow:!1});C.position.set(N*.09,.8,1.665),r.add(C);let z=Pe(new yt(.07,.2,4),"#3A2E38",{lightness:.03,castShadow:!1});z.position.set(N*.3,1.06,1.17),z.rotation.z=N*1.2,r.add(z),w.push(z);let O=[[.21,1,1.28],[.36,1.09,1.22],[.5,1.19,1.13],[.6,1.31,1.03],[.62,1.45,.94],[.56,1.56,.9]];for(let le=0;le<O.length-1;le++){let J=le/(O.length-1),Z=(le+1)/(O.length-1),$=new Me(N*O[le][0],O[le][1],O[le][2]),U=new Me(N*O[le+1][0],O[le+1][1],O[le+1][2]),V=c.clone().lerp(h,J*.9),te=.06*(1-J*.7),A=.06*(1-Z*.7),S=Gt($,U,te,A,V,{lightness:.02,figure:!0,segments:4,castShadow:!1});r.add(S)}let q=Pe(new yt(.02,.08,4),h,{lightness:.02,castShadow:!1});q.position.set(N*.56,1.59,.89),q.rotation.x=-.2,r.add(q)}let b=new ui;b.moveTo(-.11,0),b.lineTo(.11,0),b.lineTo(.075,-.78),b.lineTo(0,-1),b.lineTo(-.075,-.78),b.closePath();let _=new Ri(b),M=new he("#5A4A56"),P=new he("#9A8894");for(let N=0;N<3;N++){let C=1.08-N*.18,z=.45+N*.135;for(let O=0;O<10;O++){let q=O/10*Math.PI*2;if(Math.sin(q)>.8)continue;let le=Qs(_,(J,Z)=>{let $=rn(-Z,0,1);return Kn(M.clone().lerp(P,$*.55),.05,.015,.004)},{doubleSide:!0,castShadow:!1});le.scale.set(1,z,1),le.position.set(Math.cos(q)*.72,C,Math.sin(q)*.86),le.rotation.y=Math.PI/2-q,le.rotation.z=Math.sin(q*2.1)*.05,r.add(le)}}for(let N of[-.28,.28])for(let C of[-.52,.45]){let z=Gt(new Me(N,.7,C),new Me(N,.06,C),.075,.06,"#2A2229",{lightness:.02,figure:!0,segments:4});r.add(z);let O=Pe(new we(.14,.11,.16),"#1C171C",{lightness:.015});O.position.set(N,.055,C),r.add(O)}let R=new Ce;R.position.set(0,1,-1),r.add(R);for(let N=0;N<5;N++){let C=Pe(new yt(.09,.5-N*.04,4),"#332933",{lightness:.025,castShadow:!1});C.position.set((N-2)*.05,-N*.06,0),C.rotation.x=-2.5,C.rotation.z=(N-2)*.06,R.add(C)}let I=cs(2,2.5,.42);return I.position.z=.05,r.add(I),r.userData.rig={body:u,tail:R,ears:w,muzzle:y,chinBeard:g,baseTailZ:R.rotation.z,baseEarZ:w.map(N=>N.rotation.z),baseBodyScale:u.scale.clone(),phase:at()*6.28},r.position.set(n,ht(n,e),e),r.rotation.y=t,r.scale.setScalar(i),Xe.add(r),r}var xp=gv(-11.8,-9.2,1.45,1),Wo=mi.clone();Wo.emissive=new he(4862786);Wo.emissiveIntensity=.26;var yp=Wo.clone();yp.side=jt;xp.traverse(n=>{n.isMesh&&(n.material===mi?n.material=Wo:n.material===Ks&&(n.material=yp))});function vv(n,e,t,i=1){let r=new Ce,s="#A85C32",a=new he(s),o=new he("#CE8048"),l=new he("#6B351F"),c="#2B1D16",h="#7A3D20",u="#241C18",p=Qs(Lo([{z:-1.02,y:1.4,w:.33,h:.32},{z:-.68,y:1.42,w:.46,h:.41},{z:-.22,y:1.41,w:.49,h:.4},{z:.22,y:1.44,w:.48,h:.43},{z:.58,y:1.46,w:.4,h:.41}],8),(U,V,te,A)=>{let S=a.clone();return A.y>.3&&(S=S.lerp(o,.35)),A.y<-.15&&(S=S.lerp(l,.4)),Kn(S,.05,.016,.004)});r.add(p);let m=Gt(new Me(0,1.58,.52),new Me(0,1.96,.8),.3,.22,s,{lightness:.055,figure:!0,segments:6});r.add(m);let x=Gt(new Me(0,1.96,.8),new Me(0,2.17,1.04),.22,.17,s,{lightness:.055,figure:!0,segments:6});r.add(x);let f=Pe(new rt(.23,0),s,{lightness:.05});f.position.set(0,1.96,.8),r.add(f);let y=Pe(new we(.08,.55,.16),s,{lightness:.08,castShadow:!1});y.position.set(0,1.88,.7),y.rotation.x=-.55,r.add(y);for(let U=0;U<9;U++){let V=U/8,te=Pe(new yt(.06,.27,4),c,{lightness:.025,castShadow:!1});te.position.set(U%2?.025:-.025,1.72+V*.52,.54+V*.55),te.rotation.x=-1,te.rotation.z=U%2?.09:-.09,r.add(te)}let v=new Ce;v.position.set(0,2.16,1.08),v.rotation.x=.24,r.add(v);let g=Qs(Lo([{z:-.12,y:0,w:.135,h:.15},{z:.16,y:-.015,w:.13,h:.145},{z:.36,y:-.06,w:.095,h:.1}],7),(U,V,te,A)=>{let S=a.clone();return A.y>.35&&(S=S.lerp(o,.25)),A.y<-.15&&(S=S.lerp(l,.35)),Kn(S,.045,.015,.004)});v.add(g);let w=Pe(new we(.17,.06,.33),l,{lightness:.03});w.position.set(0,-.13,.14),v.add(w);let b=Pe(new we(.18,.16,.18),"#8D4724",{lightness:.035});b.position.set(0,-.065,.38),v.add(b);let _=[];for(let U of[-1,1]){let V=Pe(new we(.03,.025,.02),"#241813",{lightness:.01,castShadow:!1});V.position.set(U*.06,-.09,.47),v.add(V);let te=Pe(new we(.02,.035,.06),"#1D1611",{lightness:.01,castShadow:!1});te.position.set(U*.132,.025,.12),v.add(te);let A=Pe(new yt(.05,.2,4),s,{lightness:.04});A.position.set(U*.095,.18,-.03),A.rotation.z=U*.12,A.rotation.x=-.08,v.add(A),_.push(A);let S=Pe(new yt(.025,.12,4),l,{lightness:.02,castShadow:!1});S.position.set(U*.095,.18,.005),S.rotation.z=U*.12,S.rotation.x=-.08,v.add(S);let G=Pe(new we(.016,.03,.34),"#3A291E",{lightness:.02,castShadow:!1});G.position.set(U*.135,.005,.14),v.add(G)}let M=Pe(new yt(.055,.18,4),c,{lightness:.02,castShadow:!1});M.position.set(0,.16,.03),M.rotation.x=-.7,v.add(M);let P=Pe(new we(.21,.026,.03),"#3A291E",{lightness:.02,castShadow:!1});P.position.set(0,-.03,.33),v.add(P);let R=Pe(new we(.045,.16,.02),"#D9CBB8",{lightness:.03,castShadow:!1});R.position.set(0,.09,.21),R.rotation.x=-.2,v.add(R);let I=[],N=[[-1,.56,.59,.56,!1],[1,.56,.59,.56,!1],[-1,-.72,-.84,-.7,!0],[1,-.72,-.84,-.72,!1]];for(let[U,V,te,A,S]of N){let G=new Me(U*.29,1.18,V),ee=new Me(U*.31,.68,te),L=new Me(U*.31,S?.22:.14,A),Q=new Ce;Q.position.copy(G),r.add(Q);let F=ee.clone().sub(G);Q.add(Gt(new Me(0,0,0),F,.115,.085,h,{lightness:.04,figure:!0,segments:5}));let H=new Ce;H.position.copy(F),Q.add(H);let W=Pe(new rt(.09,0),h,{lightness:.04});H.add(W);let re=L.clone().sub(ee);H.add(Gt(new Me(0,0,0),re,.075,.055,"#6B351F",{lightness:.035,figure:!0,segments:5}));let ne=Pe(new we(.14,.12,.18),u,{lightness:.02});ne.position.copy(re).add(new Me(0,S?-.1:-.08,0)),H.add(ne),I.push({root:Q,knee:H,front:V>0,side:U})}let C=new Ce;C.position.set(0,1.56,-1),r.add(C);for(let U=0;U<5;U++){let V=Pe(new yt(.07,.72-U*.04,4),c,{lightness:.02,castShadow:!1});V.position.set((U-2)*.045,-U*.035,0),V.rotation.x=-2.55,V.rotation.z=(U-2)*.05,C.add(V)}let z=Pe(new we(.95,.06,.95),"#8E3A33",{lightness:.035});z.position.set(0,1.885,-.03),r.add(z);let O=Pe(new we(1,.025,.99),"#C9A45E",{lightness:.03,castShadow:!1});O.position.set(0,1.85,-.03),r.add(O);let q=Pe(new we(.55,.13,.55),"#4B2F21",{lightness:.035});q.position.set(0,1.975,-.03),r.add(q);let le=Pe(new we(.42,.18,.15),"#5A3825",{lightness:.04});le.position.set(0,2.03,.27),le.rotation.x=.22,r.add(le);let J=Pe(new we(.42,.2,.15),"#5A3825",{lightness:.04});J.position.set(0,2.03,-.31),J.rotation.x=-.18,r.add(J);let Z=Pe(new we(.34,.03,.42),"#8A6040",{lightness:.03,castShadow:!1});Z.position.set(0,2.045,-.03),r.add(Z);for(let U of[-1,1]){let V=Pe(new we(.04,.4,.09),"#3A291E",{lightness:.02,castShadow:!1});V.position.set(U*.46,1.78,-.02),r.add(V);let te=Pe(new Yt(.065,.014,3,8),"#8A8A92",{lightness:.025,castShadow:!1});te.position.set(U*.46,1.55,-.02),r.add(te);let A=Pe(new we(.1,.02,.07),"#6F7079",{lightness:.02,castShadow:!1});A.position.set(U*.46,1.485,-.02),r.add(A);let S=Gt(new Me(U*.09,2.05,1.36),new Me(U*.18,2.02,.3),.012,.012,"#3A291E",{lightness:.02,figure:!0,segments:4,castShadow:!1});r.add(S)}let $=Pe(new Yt(1,.026,3,18),"#3A291E",{lightness:.02,castShadow:!1});return $.position.set(0,1.43,.08),$.scale.set(.5,.43,1),r.add($),r.userData.rig={legs:I,tail:C,head:v,ears:_,baseHeadX:v.rotation.x,baseHeadY:v.rotation.y,baseEarZ:_.map(U=>U.rotation.z),baseX:n,baseZ:e,baseRot:t,baseY:ht(n,e)},r.position.set(n,ht(n,e),e),r.rotation.y=t,r.scale.setScalar(i),Xe.add(r),r}var Te=vv(7.9,-4.3,-1.35,1.06),Xo=mi.clone();Xo.emissive=new he(4203546);Xo.emissiveIntensity=.2;var Ep=Xo.clone();Ep.side=jt;Te.traverse(n=>{n.isMesh&&(n.material===mi?n.material=Xo:n.material===Ks&&(n.material=Ep))});var Mp=cs(1.6,2.4,.38);Mp.position.z=-.1;Te.add(Mp);function xv(n,e,t){let i=new Ce,r="#7A5233",s="#6B4529",a="#B08A5E",o=[{y:.11,zs:[-.23,.01,.25]},{y:.3,zs:[-.11,.13]}];for(let d of o)for(let p of d.zs){let m=Ee(new nt(.1,.1,.85,6),d.y<.2?r:s,{lightness:.04});m.rotation.z=Math.PI/2,m.position.set(0,d.y,p),i.add(m);let x=Ee(new nt(.093,.093,.015,6),a,{lightness:.03,castShadow:!1});x.rotation.z=Math.PI/2,x.position.set(.435,d.y,p),i.add(x)}let l=Ee(new nt(.19,.22,.3,7),"#5C4129",{lightness:.045});l.position.set(-.75,.15,.03),i.add(l);let c=Ee(new nt(.19,.19,.022,7),a,{lightness:.035,castShadow:!1});c.position.set(-.75,.31,.03),i.add(c);let h=Gt(new Me(-.8,.3,.04),new Me(-.55,.75,.02),.022,.028,"#6D4F35",{lightness:.03,segments:4});i.add(h);let u=Ee(new we(.055,.19,.21),"#7A7A84",{lightness:.04});u.position.set(-.54,.76,.02),u.rotation.z=.2,i.add(u);for(let d of[-.12,.12]){let p=Ee(new rt(.13,0),"#D8D2E8",{lightness:.03,castShadow:!1});p.scale.set(2.4,.28,.7),p.position.set(.05,.405,d),i.add(p)}return i.position.set(n,ht(n,e),e),i.rotation.y=t,Xe.add(i),i}function yv(n,e){let t=new Ce,i=Ee(new nt(.16,.125,.27,8),"#7A5A3A",{lightness:.04});i.position.y=.135,t.add(i);let r=Ee(new Yt(.148,.012,3,10),"#4A454E",{lightness:.02,castShadow:!1});r.rotation.x=Math.PI/2,r.position.y=.22,t.add(r);let s=Ee(new Yt(.145,.012,3,8,Math.PI),"#4A454E",{lightness:.02,castShadow:!1});return s.position.y=.27,t.add(s),t.position.set(n,ht(n,e),e),t.rotation.y=pt(0,Math.PI),Xe.add(t),t}xv(-1,-3.1,.35);yv(1.6,-2.2);var hh=7.4,uh=-2.5,wp=ht(hh,uh),Ap=Ee(new nt(.05,.07,1.2,5),"#5B4432",{lightness:.035});Ap.position.set(hh,wp+.6,uh);Xe.add(Ap);var Ev=Gt(new Me(hh,wp+1.12,uh),new Me(6.9,ht(7.9,-4.3)+2.05,-4.05),.014,.014,"#5A4636",{lightness:.02,castShadow:!1,segments:4});Xe.add(Ev);function Fi(n,e,t=1){let i=new Ce,r=3+Math.floor(at()*3);for(let s=0;s<r;s++){let a=pt(.45,1.05)*t,o=Ee(new sr(a,0),"#6a637c",{lightness:.06});if(o.scale.set(pt(.85,1.5),pt(.5,.9),pt(.8,1.3)),o.position.set(pt(-1.3,1.3)*t,a*.28,pt(-1.1,1.1)*t),o.rotation.set(at()*3,at()*3,at()*3),i.add(o),s===0){let l=Ee(new rt(a*.62,0),"#cbc5e2",{lightness:.025});l.scale.set(1.25,.22,1.05),l.position.set(o.position.x,a*.72,o.position.z),l.rotation.y=at()*3,i.add(l)}}return i.position.set(n,ht(n,e),e),Xe.add(i),i}Fi(-6.9,4.6,.85);Fi(6.4,5.2,.95);Fi(-4,3.8,.4);Fi(3.5,5.1,.34);Fi(-13.2,2.7,.75);Fi(21.5,-1.5,.9);Fi(-19.5,-7.5,.7);Fi(16.8,2.8,.5);function Yo(n,e,t=1){let i=[];for(let a=0;a<7;a++){let o=at()*Math.PI*2,l=Math.cos(o)*.05,c=Math.sin(o)*.05,h=Math.cos(o+Math.PI/2)*.025,u=Math.sin(o+Math.PI/2)*.025,d=pt(.2,.42),p=pt(.04,.13),m=l+Math.cos(o)*p,x=c+Math.sin(o)*p;i.push(l-h,0,c-u,l+h,0,c+u,m,d,x)}let r=new tt;r.setAttribute("position",new _e(i,3));let s=Ee(r,"#6F5C3F",{doubleSide:!0,lightness:.06,castShadow:!1});return s.position.set(n,ht(n,e)+.01,e),s.scale.setScalar(t),Xe.add(s),s}Yo(-2.2,5,1.1);Yo(2,5.2,1);Yo(-.8,4.6,.85);Yo(7.8,3.9,.8);var Sp=[];function _p(n,e,t){let i=new Ce,r=Ee(new nt(.055,.075,5.4,6),"#5a4432",{lightness:.03});r.position.y=2.7,i.add(r);let s=Ee(new yt(.09,.3,5),"#3a2d22",{lightness:.02});s.position.y=5.5,i.add(s);let a=new ui;a.moveTo(0,0),a.lineTo(.95,-.05),a.lineTo(.9,-1.42),a.lineTo(.58,-1.16),a.lineTo(.26,-1.53),a.lineTo(0,-1.3),a.closePath();let o=new Ri(a),l=new Je(ls(o,()=>Kn(new he(t),.04,.015,.004)),rh);return l.position.set(.04,5.25,0),l.castShadow=!1,l.userData.phase=at()*6.28,l.userData.baseRot=pt(-.07,.07),i.add(l),Sp.push(l),i.position.set(n,ht(n,e),e),i.rotation.y=pt(-.2,.2),Xe.add(i),i}_p(-23,-11.5,"#6b2b3e");_p(21.5,-16.5,"#3c3560");function Mv(n){let e=new Ce,t=[];n.forEach(([i,r])=>{let s=ht(i,r),a=Ee(new nt(.055,.08,1.15,5),"#5b4432",{lightness:.035});a.position.set(i,s+.55,r),e.add(a),t.push(new Me(i,s+.95,r))});for(let i=0;i<t.length-1;i++){let r=Gt(t[i],t[i+1],.018,.018,"#7a6650",{lightness:.02,castShadow:!1,segments:4});e.add(r);let s=Gt(t[i].clone().add(new Me(0,-.26,0)),t[i+1].clone().add(new Me(0,-.26,0)),.014,.014,"#6f5c47",{lightness:.02,castShadow:!1,segments:4});e.add(s)}return Xe.add(e),e}Mv([[6.8,-12.6],[9.8,-13.1],[12.9,-13.5],[16,-13.8],[19,-13.6]]);var jo=420,Po=new Float32Array(jo*3),Tp=new Float32Array(jo);for(let n=0;n<jo;n++)Po[n*3]=pt(-45,45),Po[n*3+1]=pt(0,32),Po[n*3+2]=pt(-42,28),Tp[n]=pt(.45,1.1);var Oo=new tt;Oo.setAttribute("position",new Ut(Po,3));var wv=new Ls({color:15985919,size:.062,transparent:!0,opacity:.42,depthWrite:!1,sizeAttenuation:!0}),Av=new oo(Oo,wv);Xe.add(Av);var Zs=60,th=0,bp=1,ei=(n,e=!1)=>new Ci(n.map(([t,i])=>new Me(t,0,i)),e,"centripetal"),zt=sn[0],lt=sn[1],Qt=sn[2],vn=sn[3],Ie=lt.userData.parts,nn=Qt.userData.parts,gn=vn.userData.parts,Sv=ei([[-3.35,0],[-4,.8],[-4,2.4],[-3.2,3.6],[-2,3.6],[-1,3]]),_v=ei([[-1,3],[-.2,3.8],[1.2,3.8],[2,3],[1.2,2.2],[-.2,2.2]],!0),Tv=ei([[-1,3],[-2,3.6],[-3.2,3.6],[-4,2.4],[-4,.8],[-3.35,0]]),bv=ei([[-1.45,-1.45],[1,-1.5],[3.8,-1.2],[6,-2.1],[7.15,-3.15]]),Cv=ei([[7.05,-3],[5,-2],[2.5,-1.5],[0,-1.4],[-1.45,-1.45]]),Rv=ei([[.85,-.25],[.55,-1.4],[0,-2.7],[-.4,-3.5]]),Dv=ei([[-.4,-3.5],[0,-2.7],[.55,-1.4],[.85,-.25]]),Pv=ei([[-2.4,2.5],[-3.9,1.6],[-3.7,-.6],[-2.6,-2.2],[-1.4,-2.55]]),Iv=ei([[-1.4,-2.55],[-2.6,-2.2],[-3.4,-.5],[-3.2,1.4],[-2.3,2.2]]),qd=ei([[7.9,-4.3],[5.5,-2],[4,.8],[3.6,3.2],[6,4.8],[9.2,4],[10.9,1.2],[10.2,-2.2]],!0);function yr(n){let e=n.userData.parts;e.standTarget=0,e.walking=!1,e.walkAmount=0,e.airborne=!1,e.leanOffset=0,e.targetYaw=e.baseYaw,dh(n),n.visible=!0,n.position.copy(e.basePos)}function Co(n){let e=n.userData.parts;e.standTarget=.42,e.walking=!1,e.walkAmount=0,e.airborne=!1,e.leanOffset=0,e.targetYaw=e.baseYaw,dh(n),n.visible=!0,n.position.copy(e.basePos)}function di(n,e,t,i=5.2,r=!1){let s=n.userData.parts;s.walking||(dh(n),s.walkBlend=0);let a=rn(t,0,1),o=r?ln(0,1,a):a,l=e.getPointAt(o),c=Math.min(1,o+.035),h=e.getTangentAt(c);n.position.x=l.x,n.position.z=l.z,n.position.y=ht(l.x,l.z),s.targetYaw=Math.atan2(h.x,h.z),s.standTarget=.42,s.walking=!0,s.walkAmount=1,s.airborne=!1,s.leanOffset=0}function Lv(n,e,t){let i=(e-n+Math.PI)%(Math.PI*2)-Math.PI;return i<-Math.PI&&(i+=Math.PI*2),n+i*t}var as=new Me,VE=new Me;function dh(n){let e=n.userData.parts;e.gait.initialized=!1,e.gait.cycle=0,e.standLegs.forEach(t=>{t.state="stance",t.prevPhase=0,t.phase=0,t.hip.rotation.x=0,t.hip.rotation.z=0,t.knee.rotation.x=0,t.foot.rotation.x=0})}function Kd(n){let e=n.userData.parts,t=e.baseScale,i=n.rotation.y,r=Math.cos(i),s=-Math.sin(i);e.gait.stride=1.15*t,e.gait.cycle=0,e.standLegs.forEach((a,o)=>{let l=a.side*.145*t,c=n.position.x+r*l,h=n.position.z+s*l;a.anchor.set(c,ht(c,h),h),a.swingStart.copy(a.anchor),a.landing.copy(a.anchor),a.phase=o*.5,a.prevPhase=a.phase,a.state="stance"}),e.gait.initialized=!0}function Bv(n,e,t,i){return kc(n,e,t,i)}function Uv(n,e){if(!e.gait.initialized||e.riding||e.airborne||e.standLift<.05)return!1;let t=e.gait,i=e.baseScale,r=n.rotation.y,s=Math.cos(r),a=Math.sin(r),o=Math.sin(r),l=Math.cos(r),c=Math.cos(r),h=-Math.sin(r);return e.standLegs.forEach((u,d)=>{u.hip.position.x=u.side*.145;let p=(t.cycle+d*.5)%1;if(p+1e-6<u.prevPhase&&u.state==="swing"&&(u.anchor.copy(u.landing),u.state="stance"),u.state==="stance"&&u.prevPhase<t.stanceFrac&&p>=t.stanceFrac){u.state="swing",u.swingStart.copy(u.anchor);let _=t.stride*.38,M=u.side*.145*i;u.landing.set(n.position.x+o*_+c*M,0,n.position.z+l*_+h*M),u.landing.y=ht(u.landing.x,u.landing.z)}if(p<t.stanceFrac)u.state="stance",as.copy(u.anchor);else{let _=ln(0,1,(p-t.stanceFrac)/(1-t.stanceFrac));as.lerpVectors(u.swingStart,u.landing,_),as.y+=Math.sin(Math.PI*_)*.11*i}let m=as.y+.078*i,x=as.x-n.position.x,f=as.z-n.position.z,y=(x*s-f*a)/i,v=(x*a+f*s)/i,g=(m-n.position.y)/i,w=Bv(u,y,g,v),b=-(w.hipRotation+w.kneeRotation)*.8;if(p<t.stanceFrac){let _=p/t.stanceFrac;b-=(1-ln(0,.22,_))*.1,b+=ln(.66,1,_)*.24}else{let _=(p-t.stanceFrac)/(1-t.stanceFrac);b+=Math.sin(Math.PI*_)*.14}u.foot.rotation.x=b,u.phase=p,u.prevPhase=p}),!0}function Nv(n){let e=rn(1-n.standLift/.42,0,1),t=n.legsKind==="crossed"&&n.tea;n.legs.forEach(i=>{let r=i.side;i.hip.position.x=r*.145;let s=r*(.17+.03*e)+(t?-r*.085*e:0),a=.045+(t?.245:.305)*e;kc(i,s,.075,a),i.ankle.rotation.x+=Math.sin(n.walkPhase*.5+r)*.006*e})}function Ov(n){n.legs.forEach(e=>{let t=e.side;e.hip.position.x=t*.235,n.airborne?(e.hip.rotation.x=-.45,e.hip.rotation.z=t*.38,e.knee.rotation.x=.95,e.ankle.rotation.x=-.25):(e.hip.rotation.x=-.72,e.hip.rotation.z=t*.82,e.knee.rotation.x=1.18,e.ankle.rotation.x=.16)})}function Fv(n,e,t,i,r){n.arms.forEach((s,a)=>{let o=s===n.talkArm,l=n.carryLog&&n.carryLog.visible;if(n.riding)s.desired.set(s.side*.15,.34,.3);else if(l)s.desired.set(s.side*.25,.02,.34);else if(o)s.desired.copy(s.baseTarget),s.desired.y+=n.speechEnv*.045+n.speechStress*.025,s.desired.z+=n.speechEnv*.022,s.desired.x+=Math.sin(t*1.3)*.018;else if(n.warm||n.tea)s.desired.copy(s.baseTarget),s.desired.z+=Math.sin(t*1.8+a)*.008,s.desired.y+=Math.sin(t*2.4+a*1.7)*.004;else if(r>.04||n.standLift>.22){s.desired.set(s.side*.235,.015,.055);let c=n.walkPhase+(a?Math.PI:0);s.desired.z+=Math.sin(c)*.145*r,s.desired.y+=Math.max(0,Math.sin(c))*.022*r}else s.desired.copy(s.baseTarget),s.desired.x+=Math.sin(t*.55+a*1.8)*.006,s.desired.y+=Math.sin(t*.9+a)*.004;s.update(e,15)})}function Hv(n,e,t){let i=rn(1-n.standLift/.42,0,1);n.robePanels.forEach((r,s)=>{let a=r.userData.angle,o=Math.cos(a),l=Math.sin(a),c=Math.sin(n.walkPhase-s*.45)*.038*t;r.rotation.x=-o*.3*i+o*c,r.rotation.z=l*.24*i+l*c*.5,r.rotation.y=Math.sin(e*.4+s)*.004*(1-t)})}function zv(){return Te.updateMatrixWorld(!0),Te.localToWorld(new Me(0,.98,-.03))}function Cp(){Ie.riderAttached||(Te.updateMatrixWorld(!0),Te.attach(lt),lt.position.set(0,.98,-.03),lt.rotation.set(0,0,0),lt.scale.setScalar(Ie.baseScale/Te.scale.x),Ie.riderAttached=!0,Ie.riding=!0,Ie.airborne=!1,Ie.mountStart=null,Ie.mountYaw=null)}function Gv(){Ie.riderAttached&&(Te.updateMatrixWorld(!0),Xe.attach(lt),lt.scale.setScalar(Ie.baseScale),lt.rotation.set(0,Te.rotation.y,0),Ie.riderAttached=!1,Ie.riding=!1,Ie.airborne=!0,Ie.dismountStart=lt.position.clone())}function kv(n){Ie.standTarget=.42,Ie.walking=!1,Ie.walkAmount=0,Ie.airborne=!0,Ie.leanOffset=0,Ie.mountStart||(Ie.mountStart=lt.position.clone(),Ie.mountYaw=lt.rotation.y);let e=zv(),t=ln(0,1,(n-11)/1);lt.position.lerpVectors(Ie.mountStart,e,t),lt.position.y+=Math.sin(t*Math.PI)*.24,lt.rotation.y=Lv(Ie.mountYaw,Te.rotation.y,t),t>=.999&&Cp()}function Vv(n){Ie.dismountStart||(Ie.dismountStart=lt.position.clone());let e=new Me(7.05,ht(7.05,-3),-3),t=ln(0,1,(n-38)/1);lt.position.lerpVectors(Ie.dismountStart,e,t),lt.rotation.y=Te.rotation.y,t>=.999&&(Ie.airborne=!1,Ie.dismountStart=null)}function Jd(n,e){let t=Te.userData.rig,i=n*8.2;if(e)t.legs.forEach(r=>{let s=r.front&&r.side<0||!r.front&&r.side>0,a=i+(s?0:Math.PI);r.root.rotation.x=Math.sin(a)*.36,r.knee.rotation.x=Math.max(0,Math.sin(a+.85))*.52}),Te.position.y+=Math.abs(Math.sin(i))*.018,t.head.rotation.x=t.baseHeadX+Math.sin(i*.45)*.055,t.head.rotation.y=t.baseHeadY+Math.sin(n*.6)*.045,t.tail.rotation.z=Math.sin(n*3)*.2,t.ears.forEach((r,s)=>{r.rotation.z=t.baseEarZ[s]+Math.sin(n*2.3+s)*.04});else{t.legs.forEach(s=>{s.root.rotation.x=fi(s.root.rotation.x,0,10,Ui),s.knee.rotation.x=fi(s.knee.rotation.x,0,10,Ui)});let r=Math.pow(Math.max(0,Math.sin(n*.16+.9)),8)*.22;t.head.rotation.x=t.baseHeadX+r+Math.sin(n*.6)*.045,t.head.rotation.y=t.baseHeadY+Math.sin(n*.32)*.06,t.tail.rotation.z=Math.sin(n*1.25)*.13,t.ears.forEach((s,a)=>{s.rotation.z=t.baseEarZ[a]+Math.sin(n*1.7+a)*.055})}}function Wv(n){vp.forEach((s,a)=>{let o=s.userData.rig,l=n+o.phase,c=Math.max(0,Math.sin(l*.22+a*1.3));o.head.rotation.x=o.baseHeadX+c*.3+Math.sin(l*1.3)*.025,o.head.rotation.y=o.baseHeadY+Math.sin(l*.35+a)*.1,o.head.rotation.z=o.baseHeadZ+Math.sin(l*.6+a)*.03,o.tail.rotation.z=Math.sin(l*2+a)*.16,o.ears.forEach((h,u)=>{h.rotation.z=o.baseEarZ[u]+Math.sin(l*(2+u*.5)+a)*.06}),o.body.scale.y=o.baseBodyScale.y*(1+Math.sin(l*1.1+a)*.012),o.isLamb&&(s.position.y=o.baseY+Math.max(0,Math.sin(l*1.35))*.06)});let e=mv.userData.rig,t=n+e.phase;e.tail.rotation.z=e.baseTailZ+Math.sin(t*2.2)*.22,e.ears.forEach((s,a)=>{s.rotation.z=e.baseEarZ[a]+Math.sin(t*1.7+a)*.07}),e.body.scale.y=e.baseBodyScale.y*(1+Math.sin(t*1)*.012);let i=xp.userData.rig,r=n+i.phase;i.tail.rotation.z=i.baseTailZ+Math.sin(r*1.2)*.12,i.tail.rotation.y=Math.sin(r*.5)*.25,i.ears.forEach((s,a)=>{s.rotation.z=i.baseEarZ[a]+Math.sin(r*1.3+a)*.055}),i.body.scale.y=i.baseBodyScale.y*(1+Math.sin(r*.8)*.011),i.muzzle.scale.y=1+Math.sin(r*2.5)*.03,i.chinBeard.rotation.z=Math.sin(r*2.5)*.03}var $d=(()=>{let n=Yg(20261021),e=[],t=.28;for(;t<4.82;){n()<.16&&(t+=.14+n()*.22);let i=.09+n()*.1;e.push({t,len:i,amp:.35+n()*.65,stress:n()<.22}),t+=i+.03}return e})();function ep(n,e){let t=0,i=0;for(let r of n){if(e<r.t||e>r.t+r.len+.11)continue;let s=e-r.t,a=s<.04?s/.04:1,o=s>r.len?Math.max(0,1-(s-r.len)/.1):1,l=Math.max(0,Math.min(a,o))*r.amp;t=Math.max(t,l),r.stress&&(i=Math.max(i,l))}return{env:t,stress:i}}var Ro=new Me,Do=new Me;function tp(n,e){let t=n.userData.parts;return e.set(n.position.x,n.position.y+1.55*t.baseScale,n.position.z)}function bt(n,e,t,i,r){let s=n.userData.parts;s.lookTarget.set(e,t,i),s.lookWeight=r}function Xv(n){let e=n<5?ep($d,n):{env:0,stress:0},t=n<5?ep($d,n-.2):{env:0,stress:0};sn.forEach((a,o)=>{let l=a.userData.parts;o===0?(l.speechEnv=e.env,l.speechStress=e.stress,l.reactEnv=0,l.reactStress=0):(l.reactEnv=t.env,l.reactStress=t.stress,l.speechEnv=0,l.speechStress=0)}),tp(zt,Do);let i=Do.x,r=Do.y,s=Do.z;if(n<5)tp(lt,Ro),bt(zt,Ro.x,Ro.y,Ro.z,.9),bt(lt,i,r,s,1),bt(Qt,i,r,s,1),bt(vn,i,r,s,1);else if(n<10.5){bt(zt,st.x,st.y+1.1,st.z,.65);let a=Te.rotation.y;bt(lt,Te.position.x+Math.sin(a)*1.25,Te.position.y+2.15,Te.position.z+Math.cos(a)*1.25,.85),bt(Qt,-.4,1.25,-3.4,.9),bt(vn,st.x,st.y+.9,st.z,.7)}else if(n<36){if(bt(zt,st.x,st.y+1.2,st.z,.55),n<12){let a=Te.rotation.y;bt(lt,Te.position.x+Math.sin(a)*1.25,Te.position.y+2.15,Te.position.z+Math.cos(a)*1.25,.9)}else{let a=Math.sin(Te.rotation.y),o=Math.cos(Te.rotation.y);bt(lt,Te.position.x+a*3.2,Te.position.y+1.9,Te.position.z+o*3.2,.7)}n<14.2?bt(vn,-1,.65,-3.05,.85):bt(vn,st.x,st.y+1,st.z,.8)}else n<44?(bt(zt,st.x,st.y+.9,st.z,.8),bt(lt,st.x,st.y+.9,st.z,.8),bt(Qt,st.x,st.y+.9,st.z,.8),bt(vn,i,r,s,.75)):(bt(zt,st.x,st.y+1,st.z,.75),bt(lt,i,r,s,.8),bt(Qt,i,r,s,.8),bt(vn,i,r,s,.8))}function Yv(n,e){if(n<5?yr(zt):n<6.2?Co(zt):n<9.5?di(zt,Sv,(n-6.2)/3.3,3,!0):n<36?di(zt,_v,(n-9.5)%13.25/13.25,3):n<39.5?di(zt,Tv,(n-36)/3.5,3,!0):yr(zt),n<5.3?np():n<6.5?Co(lt):n<11?di(lt,bv,(n-6.5)/4.5,5.2,!0):n<12?kv(n):n<38?(Ie.riderAttached||Cp(),Ie.standTarget=.42,Ie.walking=!1,Ie.walkAmount=0,Ie.airborne=!1,Ie.leanOffset=.08):n<39?(Ie.riderAttached&&Gv(),Vv(n)):n<44?(Ie.riding=!1,Ie.airborne=!1,di(lt,Cv,(n-39)/5,5.2,!0)):np(),n<5.6)nn.hidden=!1,Qt.visible=!0,yr(Qt);else if(n<6.8)Co(Qt);else if(n<10.5)di(Qt,Rv,(n-6.8)/3.7,4.4,!0);else if(n<35)nn.hidden=!0,nn.standTarget=.42,nn.walking=!1,nn.walkAmount=0,nn.airborne=!1,Qt.visible=!1,Qt.position.set(-.4,ht(-.4,-3.5),-3.5);else if(n<35.5){let i=Math.atan2(st.x+.4,st.z+3.5);nn.hidden=!1,Qt.visible=!0,Qt.position.set(-.4,ht(-.4,-3.5),-3.5),Qt.rotation.y=i,nn.targetYaw=i,nn.standTarget=.42,nn.walking=!1,nn.walkAmount=0,nn.airborne=!1,nn.leanOffset=0}else n<39.5?(nn.hidden=!1,Qt.visible=!0,di(Qt,Dv,(n-35.5)/4,4.4,!0)):(nn.hidden=!1,yr(Qt));if(n<5.9)yr(vn),gn.carryLog.visible=!1;else if(n<10)Co(vn);else if(n<12.9)di(vn,Pv,(n-10)/2.9,5.2,!0);else if(n<14.2)gn.standTarget=.42,gn.walking=!1,gn.walkAmount=0,gn.leanOffset=Math.max(0,Math.sin((n-12.9)/1.3*Math.PI))*.34,gn.carryLog.visible=!0;else if(n<17.2)di(vn,Iv,(n-14.2)/3,5.2,!0),gn.carryLog.visible=!0;else if(n<19.7){let i=Math.atan2(st.x+2.3,st.z-2.2);gn.standTarget=.42,gn.walking=!1,gn.walkAmount=0,gn.leanOffset=.24,gn.carryLog.visible=n<17.6,vn.position.set(-2.3,ht(-2.3,2.2),2.2),vn.rotation.y=i,gn.targetYaw=i}else yr(vn),gn.carryLog.visible=!1;if(n>=12&&n<38){let i=rn((n-12)/26,0,1),r=qd.getPointAt(i),s=qd.getTangentAt(i);Te.position.set(r.x,ht(r.x,r.z),r.z),Te.rotation.y=Math.atan2(s.x,s.z),Jd(e,!0)}else Te.position.set(Te.userData.rig.baseX,Te.userData.rig.baseY,Te.userData.rig.baseZ),Te.rotation.y=Te.userData.rig.baseRot,Jd(e,!1);bp=nn.hidden?1.35+Math.sin(e*2.2)*.06:1;let t=ov.userData.doorLeaf;if(t){let i=ln(10.2,10.7,n)*(1-ln(35,35.5,n));t.rotation.y=-i*1.15}Xv(n)}function np(){Ie.riderAttached&&(Xe.attach(lt),lt.scale.setScalar(Ie.baseScale),Ie.riderAttached=!1,Ie.riding=!1),Ie.mountStart=null,Ie.mountYaw=null,Ie.dismountStart=null,yr(lt)}function jv(){for(let e=0;e<sn.length;e++){let t=sn[e],i=t.userData.parts;if(!(i.walkAmount<.15||i.riding||i.hidden||i.airborne))for(let r=0;r<sn.length;r++){if(e===r)continue;let s=sn[r],a=s.userData.parts;if(a.hidden||a.riding)continue;let o=t.position.x-s.position.x,l=t.position.z-s.position.z,c=Math.hypot(o,l);if(c>.001&&c<.95){let h=.95-c;t.position.x+=o/c*h,t.position.z+=l/c*h}}}}var Xs=[{start:0,end:3,from:{pos:[1.4,5.4,14.2],target:[0,2.35,-3.7],fov:48},to:{pos:[.55,4.35,11.8],target:[-.25,2.1,-3.15],fov:46},hand:0},{start:3,end:6.2,from:{pos:[1.2,3.5,6.6],target:[-1.6,1.05,.2],fov:40},to:{pos:[.8,3.2,5.8],target:[-1.75,1.05,.25],fov:38},hand:.006},{start:6.2,end:12,from:{pos:[2.2,3.6,7.4],target:[-1,1.2,.3],fov:39},to:{pos:[1.8,3.2,6.8],target:[-.9,1.2,.5],fov:38},hand:.012},{start:12,end:18,track:"singer",fov:37,hand:.008},{start:18,end:28,track:"horse",fov:40,hand:.015},{start:28,end:36,track:"horseWide",fov:50,hand:.008},{start:36,end:44,from:{pos:[2.85,1.86,3.15],target:[-.4,1.28,-3.45],fov:33},to:{pos:[2,1.98,2.25],target:[-.5,1.38,-3.35],fov:31},hand:.006},{start:44,end:60,from:{pos:[.8,4.1,11],target:[-.35,2,-2.7],fov:46},to:{pos:[1.4,5.4,14.2],target:[0,2.35,-3.7],fov:48},hand:.005}],Fo=document.getElementById("view-toggle"),ip=document.querySelector(".hint"),Zv=document.getElementById("stage"),Io=new Me(0,2.3,-3.5),Bi=new Me,pi=new Me,ea=!0,nh=-1,ph=!1;Ct.enabled=!1;function Qv(n){ea=!n,ph=!1,Ct.enabled=n,nh=-1,n&&(Ct.target.copy(Io),vt.fov=50,vt.updateProjectionMatrix(),Ct.update()),Zv.classList.toggle("free",n),Fo&&(Fo.textContent=n?"Cinematic camera":"Free look"),ip&&(ip.textContent=n?"60-second camp story \xB7 free camera":"60-second camp story \xB7 cinematic camera")}Fo&&Fo.addEventListener("click",()=>Qv(ea));var Jc=document.getElementById("quality-toggle");Jc&&Jc.addEventListener("click",()=>{Ys=!Ys,It.autoClear=!Ys,Jc.textContent=Ys?"Quality: High":"Quality: Low"});function qv(n,e){if(!ea)return;let t=Xs.length-1;for(let o=0;o<Xs.length;o++)if(n>=Xs[o].start&&n<Xs[o].end){t=o;break}let i=Xs[t],r=nh!==t;nh=t;let s=ln(0,1,rn((n-i.start)/(i.end-i.start),0,1));if(i.track==="singer")pi.set(zt.position.x+3.1+s*.18,zt.position.y+2.92+s*.08,zt.position.z+3.85+s*.18),Bi.set(zt.position.x+.05,zt.position.y+1.18,zt.position.z),r&&(vt.fov=i.fov);else if(i.track==="horse"){let o=Te.rotation.y,l=Math.sin(o),c=Math.cos(o),h=Math.cos(o),u=-Math.sin(o),d=5.6-s*.8,p=-2+s*.5;pi.set(Te.position.x+h*d-l*p,Te.position.y+2.7+s*.2,Te.position.z+u*d-c*p),Bi.set(Te.position.x+l*(1+s*.55),Te.position.y+2.05,Te.position.z+c*(1+s*.55)),r&&(vt.fov=i.fov)}else if(i.track==="horseWide"){let o=Te.rotation.y,l=Math.sin(o),c=Math.cos(o),h=Math.cos(o),u=-Math.sin(o),d=9.5+s*1,p=4.8+s*1.2;pi.set(Te.position.x+h*d-l*p,Te.position.y+5.7+s*.4,Te.position.z+u*d-c*p),Bi.set(Te.position.x+l*.8,Te.position.y+1.55,Te.position.z+c*.8),r&&(vt.fov=i.fov)}else pi.set(Fn.lerp(i.from.pos[0],i.to.pos[0],s),Fn.lerp(i.from.pos[1],i.to.pos[1],s),Fn.lerp(i.from.pos[2],i.to.pos[2],s)),Bi.set(Fn.lerp(i.from.target[0],i.to.target[0],s),Fn.lerp(i.from.target[1],i.to.target[1],s),Fn.lerp(i.from.target[2],i.to.target[2],s));let a=i.hand||0;if(a){let o=Zt(n*.45+11)*a,l=Zt(n*.38+27)*a*.65,c=Zt(n*.42+43)*a;pi.x+=o,pi.y+=l,pi.z+=c,Bi.x+=Zt(n*.3+64)*a*.5,Bi.y+=Zt(n*.26+72)*a*.35}if(r)Io.copy(Bi),vt.position.copy(pi),vt.fov=i.track?i.fov:i.from.fov;else{Io.lerp(Bi,1-Math.exp(-7*e)),vt.position.copy(pi);let o=i.track?i.fov:Fn.lerp(i.from.fov,i.to.fov,s);vt.fov=fi(vt.fov,o,8,e)}vt.lookAt(Io),vt.updateProjectionMatrix()}var Kv=new xo,$c=0,Rp=!1;function Dp(n,e){let t=((e+th)%Zs+Zs)%Zs;Yv(t,e),jv(),qv(t,n);let i=1+Math.sin(e*12.5)*.05+Math.sin(e*7.1+1.7)*.03;js.intensity=7*i,js.position.x=Math.sin(e*9.3)*.06,js.position.z=Math.cos(e*8.1)*.06,Vo.material.opacity=.26+i*.08,ch.material.opacity=.22+i*.08,pp.forEach((s,a)=>{s.intensity=6*(1+Math.sin(e*5.3+a*1.7)*.05+Math.sin(e*11+a*2.1)*.025)*(a===0?bp:1)}),sn.forEach(s=>{let a=s.userData.parts,o=e+a.animPhase,l=e+a.noiseSeed,c=Math.sin(o*1.15)*.004+Zt(l*.33)*.0022;a.standLift=fi(a.standLift,a.standTarget,9,n);let h=s.parent===Xe?Math.hypot(s.position.x-a.prevX,s.position.z-a.prevZ):0,u=h/Math.max(n,.001);a.prevX=s.position.x,a.prevZ=s.position.z,a.speed=fi(a.speed,u,10,n);let d=0,p=0;if(a.lookWeight>.001){let R=a.lookTarget.x-s.position.x,I=a.lookTarget.z-s.position.z,N=Math.max(.001,Math.hypot(R,I)),C=Math.atan2(R,I);d=rn(eh(s.rotation.y,C),-.85,.85)*a.lookWeight;let z=s.position.y+1.52*a.baseScale;p=rn(Math.atan2(-(a.lookTarget.y-z),N),-.45,.5)*a.lookWeight}a.lookYaw=Yd(a.lookYaw,d,3.6,n),a.lookPitch=fi(a.lookPitch,p,3.6,n),a.gazeX=fi(a.gazeX,d*.0034+Zt(l*.9)*6e-4,12,n);let m=a.walking&&a.speed>.06?1:0;a.walkBlend=fi(a.walkBlend,m,10,n);let x=a.walkBlend;if(a.walking&&a.standLift>.05&&!a.gait.initialized&&Kd(s),a.gait.initialized&&(h>a.baseScale*.45?Kd(s):a.gait.cycle=(a.gait.cycle+h/a.gait.stride)%1,a.walkPhase=a.gait.cycle*Math.PI*2),!a.riding&&!a.airborne&&s.parent===Xe){let R=a.gait.initialized?a.gait.cycle:0;s.position.y=ht(s.position.x,s.position.z)+Math.abs(Math.sin(R*Math.PI*2))*.025*x-.012*x}let f=Zt(l*.11)*.009*(1-x);a.upper.position.x=Math.sin(a.walkPhase)*.013*x+f,a.upper.position.y=a.baseUpperY+a.standLift+c+Math.sin(a.walkPhase*2)*.005*x,a.legs.forEach(R=>{R.hip.position.y=a.upper.position.y}),a.upper.rotation.x=a.baseLean+a.leanOffset+x*.022+Math.sin(o*.8+.7)*.008+Zt(l*.19)*.004,a.upper.rotation.y=Math.sin(a.walkPhase)*.045*x+Zt(l*.15+4.1)*.006*(1-x);let y=0;!a.riding&&!a.airborne?(y=eh(s.rotation.y,a.targetYaw),s.rotation.y=Yd(s.rotation.y,a.targetYaw,14,n),a.upper.rotation.z=Math.sin(o*.55)*.008+rn(y,-.5,.5)*.12*x):a.upper.rotation.z=Math.sin(o*.55)*.008,Uv(s,a)||(a.riding||a.airborne?Ov(a):Nv(a)),Fv(a,n,o,l,x),Hv(a,o,x),a.sashTail.rotation.z=a.sashBaseZ+Math.sin(a.walkPhase-.5)*.06*x+Math.sin(o*1.3)*.008,a.sashTail.rotation.x=a.sashBaseX+Math.cos(a.walkPhase*.8)*.06*x,a.standShadow.visible=!a.riding&&!a.airborne;let g=a.sing?.05:a.tea?.012:.018,w=a.sing?.018:a.tea?.028:a.listen?.02:.012,b=a.speechStress*.045+a.reactStress*.035;a.head.rotation.y=a.baseHeadY+(Math.sin(o*(a.sing?.55:.4))*g+Zt(l*.23)*.014)+a.lookYaw-a.upper.rotation.y*.8,a.head.rotation.x=a.baseHeadX+Math.sin(o*(a.tea?.6:.45))*w+a.speechEnv*-.018+b+a.lookPitch+Zt(l*.19+8.3)*.01+(a.tea?Math.max(0,Math.sin(o*.5))*.04:0)+(a.listen?Math.max(0,Math.sin(o*1.25))*.012:0),a.head.rotation.z=a.baseHeadZ+Math.sin(o*.5)*(a.sing?.026:.008)+Zt(l*.21+3.7)*.007,e>a.nextBlink&&(a.blinkStart=e,a.nextBlink=e+2.2+at()*4.2,a.doubleBlink=at()<.16);let _=e-a.blinkStart,P=_>=0&&_<.12||a.doubleBlink&&_>.23&&_<.34?.08:1;if(a.eyes.forEach((R,I)=>{let N=a.eyeBaseY*P;R.group.scale.y=fi(R.group.scale.y,N,22,n),R.pupil.position.x=R.baseX+a.gazeX+Zt(l*1.15+I*2.7)*7e-4,R.pupil.position.y=R.baseY+a.gazeY+a.lookPitch*.0016+Zt(l*.95+I*1.9)*6e-4}),a.brows.forEach((R,I)=>{R.mesh.rotation.z=R.baseZ+Math.sin(o*(a.sing?1.8:.8)+I)*(a.sing?.012:.006)+(I===0?-1:1)*a.speechStress*.025,R.mesh.position.y=R.baseY+a.speechStress*.004+a.reactStress*.003+Zt(l*.5+I)*8e-4}),a.sing){let R=rn(a.speechEnv,0,1);a.mouth.scale.y=.42+R*1.35,a.mouth.scale.x=1+R*.06}else a.mouth.scale.y=1+Math.sin(o*.9)*.025+a.reactEnv*.05;a.tea&&a.bowl&&(a.bowl.position.y=a.baseBowlY+.015*Math.sin(o*.55)+Zt(l*.4)*.003,a.bowl.rotation.z=Math.sin(o*.4)*.02)}),mp.forEach((s,a)=>{let o=s.userData.phase,l=.92+Math.sin(e*(10+a*1.3)+o)*.12+Math.sin(e*18+o)*.04;s.scale.set(1+Math.sin(e*5.2+o)*.05,l,1),s.rotation.y=s.userData.baseRotY+Math.sin(e*1.6+o)*.12,s.rotation.z=Math.sin(e*2.3+o)*.03,s.position.x=Math.sin(e*3.4+o)*.02}),dp.forEach(s=>{let a=s.userData,o=(a.phase+e*a.speed)%1;s.position.set(a.base.x+a.drift*o+Math.sin(o*7+a.phase*9)*.22,a.base.y+o*4.3,a.base.z+Math.cos(o*5+a.phase*6)*.25);let l=a.size*(.6+o*1.45);s.scale.setScalar(l),s.material.opacity=.22*(1-o)*(o<.08?o/.08:1),s.rotation.y=o*3}),Sp.forEach(s=>{s.rotation.z=s.userData.baseRot+Math.sin(e*1.15+s.userData.phase)*.035,s.rotation.y=Math.sin(e*.8+s.userData.phase)*.06}),hp.forEach(s=>{s.position.x=s.userData.baseX+Math.sin(e*.016+s.userData.phase)*9}),Er.position.x+=n*.9,Er.position.y=24+Math.sin(e*.35)*1.1,Er.position.x>130&&(Er.position.x=-130),up.forEach((s,a)=>{let o=s.userData.phase,l=Math.sin(e*5.2+o)*.52;s.userData.left.rotation.z=l,s.userData.right.rotation.z=-l,s.position.y+=Math.sin(e*1.2+a)*6e-4});let r=Oo.attributes.position.array;for(let s=0;s<jo;s++)r[s*3]+=n*.32,r[s*3+1]-=n*Tp[s],r[s*3+1]<0&&(r[s*3]=pt(-45,45),r[s*3+1]=pt(24,34),r[s*3+2]=pt(-42,28));Oo.attributes.position.needsUpdate=!0,Wv(e),t>5&&t<45&&(It.shadowMap.needsUpdate=!0)}function ih(){!ea&&!ph&&Ct.update(),Ys?Ho.render():(It.autoClear=!0,It.render(Xe,vt))}function Pp(){requestAnimationFrame(Pp);let n=Math.min(Kv.getDelta(),.1);if(!Rp){$c+=n;let e=0;for(;$c>=Ui&&e<6;)Dp(Ui,os),os+=Ui,$c-=Ui,e++}ih()}function Jv(){let n=Ni.clientWidth,e=Ni.clientHeight;!n||!e||(vt.aspect=n/e,vt.updateProjectionMatrix(),It.setSize(n,e,!1),Ho.setSize(n,e))}new ResizeObserver(Jv).observe(Ni);window.__steppe={renderer:It,scene:Xe,camera:vt,controls:Ct,people:sn,horse:Te,setStoryTime:n=>{th=n-os%Zs},setPaused:n=>{Rp=!!n},portrait:(n=0,e=.65,t=2.6,i=34,r="head")=>{let s=sn[n]||sn[0],a=s.userData.parts,o=r==="body"?s.position.y+.58*a.baseScale:s.position.y+(a.upper.position.y+.66)*a.baseScale,l=new Me(s.position.x,o,s.position.z),c=s.rotation.y+e;ea=!1,ph=!0,Ct.enabled=!1,vt.fov=i,vt.position.set(l.x+Math.sin(c)*t,l.y+.16,l.z+Math.cos(c)*t),vt.lookAt(l),Ct.target.copy(l),vt.updateProjectionMatrix(),ih()},seek:(n,e=45)=>{th=n-os%Zs;for(let t=0;t<e;t++)Dp(Ui,os),os+=Ui;ih()}};Pp();requestAnimationFrame(()=>{document.body.classList.add("ready"),setTimeout(()=>{let n=document.getElementById("loader");n&&n.remove()},1e3)});})();
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
/*! Bundled license information:

postprocessing/build/index.js:
  (**
   * postprocessing v6.36.4 build Tue Nov 05 2024
   * https://github.com/pmndrs/postprocessing
   * Copyright 2015-2024 Raoul van Rüschen
   * @license Zlib
   *)
*/
