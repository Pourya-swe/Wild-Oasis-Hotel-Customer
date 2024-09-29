function Spinner({ message }) {
  return (
    <div className="grid item-center justify-center">
      <div className="spinner"></div>
      <p className="text-lx text-primary-200">{message}</p>
    </div>
  );
}

export default Spinner;
