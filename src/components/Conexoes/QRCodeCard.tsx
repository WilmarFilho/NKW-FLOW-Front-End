import './qrCodeCard.css';

export default function QRCodeCard() {
  return (
    <div className="qrcode-card">
      <p>Aponte a câmera<br />para o QR Code</p>
      <img src="/qrcode.png" alt="QR Code" />
    </div>
  );
}
