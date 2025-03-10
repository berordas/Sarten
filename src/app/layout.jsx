import "../public/styles/globals.css"; 
import "../public/styles/footer_style.css"; 
import "../public/styles/header_style.css"; 
import "../public/styles/contact_button.css"; 
import Link from "next/link";

export const metadata = {
  title: "SartenAuctions",
  description: "Compra y vende sartenes en subastas online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header>
          <div className="logo">SartenAuctions</div>
          <nav>
              <Link href="/">Inicio</Link>
              <Link href="#">Servicios</Link>
              <Link href="/finder">Productos</Link>
              <Link href="#">Nosotros</Link>
          </nav>
          <a href="/login" className="cta-button">Iniciar Sesion</a>
        </header>
        {children}
        <footer>
          <section className="footer-container">
              <section className="footer-section">
                  <h3>Sobre Nosotros</h3>
                  <p>Somos una empresa dedicada a ofrecer una plataforma para vender sartenes por todo el mundo.</p>
              </section>
              <section className="footer-section">
                  <h3>Enlaces Útiles</h3>
                  <ul>
                      <li><a href="#">Términos de Uso</a></li>
                      <li><a href="#">Política de Privacidad</a></li>
                      <li><a href="#">Contacto</a></li>
                      <li><a href="#">Preguntas Frecuentes</a></li>
                  </ul>
              </section>
              <section className="footer-section">
                  <h3>Síguenos</h3>
                  <ul className="social-icons">
                      <a href="#">🔵</a>
                      <a href="#">🟣</a>
                      <a href="#">🔴</a>
                  </ul>
                </section>
              </section>

            <section className="footer-bottom">
                &copy; 2025 SartenAuctions | Todos los derechos reservados
            </section>
        </footer>
    </body>
  </html>
  );
}
