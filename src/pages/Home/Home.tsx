import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { PLANS } from '@/constants';
import { formatCurrency } from '@/utils';
import styles from './Home.module.css';

const benefits = [
  {
    icon: '🎯',
    title: 'Focado no seu momento',
    description: 'Perfeito para primeiro emprego, estágio e jovem aprendiz.',
  },
  {
    icon: '🤖',
    title: 'Inteligência Artificial',
    description: 'IA que escreve seu objetivo profissional e destaca suas qualidades.',
  },
  {
    icon: '✅',
    title: 'Aprovado pelo ATS',
    description: 'Formato que passa pelos filtros automáticos das empresas.',
  },
  {
    icon: '📊',
    title: 'Pontuação inteligente',
    description: 'Saiba exatamente o que melhorar no seu currículo.',
  },
];

const steps = [
  { number: 1, title: 'Preencha seus dados', description: 'Guia passo a passo, simples e rápido.' },
  { number: 2, title: 'IA otimiza pra você', description: 'Objetivo profissional e descrições melhoradas.' },
  { number: 3, title: 'Baixe e candidate-se', description: 'PDF profissional pronto para enviar.' },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Badge variant="primary">Novo</Badge>
          <h1 className={styles.heroTitle}>
            Seu primeiro currículo
            <span className={styles.highlight}> profissional</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Crie um currículo que impressiona recrutadores, mesmo sem experiência.
            IA especializada em primeiro emprego, estágio e jovem aprendiz.
          </p>
          <div className={styles.heroCta}>
            <Button size="lg" onClick={() => navigate('/editor')}>
              Criar meu currículo grátis
            </Button>
            <span className={styles.heroNote}>Não precisa de cadastro para começar</span>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Por que o PrimeiroCV?</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <Card key={benefit.title} padding="lg">
                <span className={styles.benefitIcon}>{benefit.icon}</span>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Como funciona</h2>
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Planos simples e acessíveis</h2>
          <p className={styles.sectionSubtitle}>
            Comece grátis. Pague apenas quando quiser baixar.
          </p>
          <div className={styles.plansGrid}>
            {Object.values(PLANS).map((plan) => (
              <Card
                key={plan.type}
                variant={plan.popular ? 'elevated' : 'outlined'}
                padding="lg"
                className={plan.popular ? styles.popularPlan : ''}
              >
                {plan.popular && (
                  <Badge variant="secondary" className={styles.popularBadge}>
                    Mais escolhido
                  </Badge>
                )}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceValue}>{formatCurrency(plan.price)}</span>
                  <span className={styles.pricePeriod}>pagamento único</span>
                </div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.planFeature}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => navigate('/editor')}
                >
                  Começar agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Pronto para conquistar sua primeira vaga?
          </h2>
          <p className={styles.ctaSubtitle}>
            Milhares de jovens já criaram seus currículos com o PrimeiroCV.
          </p>
          <Button size="lg" onClick={() => navigate('/editor')}>
            Criar meu currículo agora
          </Button>
        </div>
      </section>
    </div>
  );
}
