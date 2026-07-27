import useReveal from "../hooks/useReveal";

const RevealSection = ({ index, title, children, noBorder = false }) => {
  const [ref, inView] = useReveal();

  return (
    <section
      ref={ref}
      className={`section ${inView ? "in-view" : ""}`}
      style={noBorder ? { borderBottom: "none" } : {}}
    >
      <div className="section-head">
        <span className="section-index">{index}</span>
        <span className="section-title">{title}</span>
      </div>
      {children}
    </section>
  );
};

export default RevealSection;
