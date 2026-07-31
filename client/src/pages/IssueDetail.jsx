import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IssuePanel } from '../components/IssuePanel.jsx';

export function IssueDetail() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/map" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-teal-300">
        <ArrowLeft size={15} /> Back to map
      </Link>
      <div className="card overflow-hidden" style={{ minHeight: '60vh' }}>
        <IssuePanel issueId={id} showOpenLink={false} />
      </div>
    </div>
  );
}
