import Rive, { Alignment, Fit, Layout } from "@rive-app/react-canvas";

export const RiveComponent = () => {
  return (
    <div style={{width: "100%"}}>
      <Rive
        src="https://cdn.rive.app/animations/vehicles.riv"
        stateMachines="bumpy"
        layout={new Layout({ fit: Fit.Fill, alignment: Alignment.Center })}
        shouldResizeCanvasToContainer={true}
      />
    </div>
  );
};
