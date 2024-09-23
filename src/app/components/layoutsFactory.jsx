// LayoutsFactory.js
import layoutMap from "./layouts/";

const LayoutsFactory = ({ name, ...props }) => {
  const LayoutComponent = layoutMap[name];
 

  if (!LayoutComponent) {
    return <div>Unknown layout: {name}</div>; // Fallback for unknown layouts
  }

  return <LayoutComponent {...props} />;
};

export default LayoutsFactory;
