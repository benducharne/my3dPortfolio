import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.roomChildren = {};

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    console.log(this.actualRoom.children);
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      console.log("child", child);

      if (child.name === "Aquarium") {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0;
        child.children[0].material.color.set(0x549dd2);
        child.children[0].material.ior = 3;
        child.children[0].material.transmission = 1;
        child.children[0].material.opacity = 1;
      }

      if (child.name === "Computer") {
        child.children[1].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }

      if (child.name === "Mini_Floor") {
        child.position.x = -0.289521;
        child.position.z = 8.83572;
      }

      child.scale.set(0, 0, 0);

      if (child.name === "Ben") {
        child.scale.set(1, 1, 1);
        child.children.forEach((c) => {
          if (c.type != "Bone") {
            c.castShadow = true;
            c.receiveShadow = true;
            c.frustumCulled = false;
            c.scale.set(0, 0, 0);
          }
        });
      }

      if (child.name === "Cube") {
        child.scale.set(1, 1, 1);
        child.position.set(0, -1, 0);
        child.rotation.y = Math.PI / 4;
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });

    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
    rectLight.position.set(7.68244, 7, 0.5);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 4;
    this.actualRoom.add(rectLight);

    this.roomChildren["rectLight"] = rectLight;

    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);
    // console.log(this.room);

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.11, 0.11, 0.11);
  }

  setAnimation() {
    console.log("animations", this.room.animations);
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
    this.ben = this.mixer.clipAction(this.room.animations[1]);
    this.ben.play();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.05;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease);

    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
