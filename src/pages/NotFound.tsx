import { NotFoundPage as PremiumNotFound } from '@/components/ui/404-page-not-found';
import SEO from '../components/seo/SEO';

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        url="/404"
        noIndex
      />
      <PremiumNotFound />
    </>
  );
};

export default NotFound;

