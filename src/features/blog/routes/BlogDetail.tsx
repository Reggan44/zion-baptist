import { Link } from 'react-router-dom';
import { Button } from '../../../components/elements/Button';
import { ChevronLeft, Construction } from 'lucide-react';

const BlogDetail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Construction size={48} className="mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">This article is protected or currently under maintenance. Please check back later.</p>
        <Link to="/blog">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft size={18} className="mr-2" /> Back to Blog
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
