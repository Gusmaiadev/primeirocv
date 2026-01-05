import { Link } from 'react-router-dom';
import './Footer.styles.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">📄</span>
              <span className="footer-logo-text">PrimeiroCV</span>
            </Link>
            <p className="footer-tagline">
              Seu primeiro passo para o mercado de trabalho.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">Produto</h4>
              <ul className="footer-list">
                <li>
                  <Link to="/editor">Criar Currículo</Link>
                </li>
                <li>
                  <Link to="/pricing">Planos</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Suporte</h4>
              <ul className="footer-list">
                <li>
                  <a href="mailto:contato@primeirocv.com.br">Contato</a>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Legal</h4>
              <ul className="footer-list">
                <li>
                  <Link to="/terms">Termos de Uso</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacidade</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} PrimeiroCV. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
