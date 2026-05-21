import PageUnavailable from '../../../components/page/PageUnavailable.jsx';

/** @deprecated Użyj PageUnavailable */
export default function PagePlaceholder({ name, description }) {
  return (
    <PageUnavailable
      title={name}
      description={description ?? 'Ta sekcja aplikacji jest w przygotowaniu.'}
    />
  );
}
