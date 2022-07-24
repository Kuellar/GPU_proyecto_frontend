# Void Seeker

### Search voids around the galaxy!

Visit https://icuellar.com/voidseeker/

![Photo1](https://github.com/Kuellar/voidseeker/blob/main/album/photo1.png)
![Photo2](https://github.com/Kuellar/voidseeker/blob/main/album/photo2.png)
![Photo3](https://github.com/Kuellar/voidseeker/blob/main/album/photo3.png)

---
## File organization
| File | Description |
|---|---|
| index.html/js/css | main files |
| action.js | Manage every user action |
| request.js | Create request to the sdss api 
| shaders.js | Implement fragment and vertex shaders |
| voidseeker.js | Manage data structures |
---
## Development

### Requirements
- [Node](https://nodejs.org/es/): +18.5.0
- npm: +8.12.1

### Install
1. `npm install`
2. `npm run css-build` (apply at every index.scss change)

### Run
1. `npm start`

### Deploy
1. Remove .cache folder
2. Remove dist folder
3. `npm run build-dev`  (Edit `package.json`)
4. `npm run push-gh-pages`

---
## Acknowledgments
### Papers
- [Delaunay based algorithm for finding polygonal voids in planar point sets](https://repositorio.uchile.cl/handle/2250/149921)
- [Algoritmo paralelo para vacíos poligonales en triangulaciones de Delaunay](https://repositorio.uchile.cl/handle/2250/142811) (The idea is implement this)

### Stack
- [Three.js](https://threejs.org/): JS 3D library.
- [Delaunator](https://github.com/mapbox/delaunator): JS library for Delaunay triangulations.
- [Bulma](https://bulma.io/documentation/): CSS framework.
- [Parcel](https://parceljs.org/): Build tool.
