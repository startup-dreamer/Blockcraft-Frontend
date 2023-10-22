import { useStore } from "../hooks/useStore";
import Cube from "./Cube";

const Cubes = () => {
  const [cubes, targetCubes, levelMode, switchModal] = useStore((state) => [
    state.cubes,
    state.targetCubes,
    state.levelMode,
    state.switchModal,
  ]);
  if (switchModal) {
    // if (switchModal) {
    //   return cubes.map(({ key, pos, texture }) => {
    //     return <Cube key={key} position={pos} texture={texture} />;
    //   });
    // } else {
    return targetCubes.map(({ key, pos, texture }) => {
      return <Cube key={key} position={pos} texture={texture} />;
    });
    // }
  } else {
    return cubes.map(({ key, pos, texture }) => {
      return <Cube key={key} position={pos} texture={texture} />;
    });
  }
};

export default Cubes;
