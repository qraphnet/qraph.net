import './style.css';
import { IconAnimation } from './icon-animation';
import { Canvas } from './canvas';

const canvas = new Canvas('icon-animation');
const animation = new IconAnimation(canvas);
// animation.render();

const render = () => {
  animation.render();
  requestAnimationFrame(render);
};
render();