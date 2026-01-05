import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { PLANS } from '@/constants';
import { formatCurrency } from '@/utils';
import styles from './Plans.module.css';

export function Plans() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Escolha seu plano</h1>
        <p className={styles.subtitle}>
          Invista no seu futuro profissional. Pagamento único, sem mensalidade.
        </p>
      </div>

      <div className={styles.grid}>
        {Object.values(PLANS).map((plan) => (
          <Card
            key={plan.type}
            variant={plan.popular ? 'elevated' : 'outlined'}
            padding="lg"
            className={plan.popular ? styles.popular : ''}
          >
            {plan.popular && (
              <Badge variant="secondary" className={styles.badge}>
                Mais escolhido
              </Badge>
            )}
            
            <h2 className={styles.planName}>{plan.name}</h2>
            
            <div className={styles.price}>
              <span className={styles.priceValue}>{formatCurrency(plan.price)}</span>
              <span className={styles.pricePeriod}>
                Acesso por {plan.limits.validDays} dias
              </span>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className={styles.check}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              fullWidth
              onClick={() => navigate('/editor')}
            >
              Escolher {plan.name}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
