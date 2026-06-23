const STEPS = [
  { key: "received", label: "Order Received", icon: "✅", desc: "We got your order!" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳", desc: "Kitchen is cooking your food" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵", desc: "On the way to you!" },
  { key: "delivered", label: "Delivered", icon: "🎉", desc: "Enjoy your meal!" },
];

const STEP_INDEX = { received: 0, preparing: 1, out_for_delivery: 2, delivered: 3, cancelled: -1 };

const StatusStepper = ({ status }) => {
  if (status === "cancelled") {
    return (
      <div className="status-stepper status-stepper--cancelled">
        <span className="cancelled-icon">❌</span>
        <p>This order has been cancelled.</p>
      </div>
    );
  }

  const currentIndex = STEP_INDEX[status] ?? 0;

  return (
    <div className="status-stepper">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div key={step.key} className={`stepper-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
            <div className="stepper-icon-wrap">
              <div className="stepper-icon">{step.icon}</div>
              {idx < STEPS.length - 1 && <div className="stepper-line" />}
            </div>
            <div className="stepper-label">
              <span className="stepper-title">{step.label}</span>
              {isActive && <span className="stepper-desc">{step.desc}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
