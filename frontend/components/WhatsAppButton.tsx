export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp पर बात करें"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "#25D366",
        color: "#fff",
        borderRadius: "50%",
        width: 62,
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 999,
        textDecoration: "none",
      }}
    >
      💬
    </a>
  );
}
