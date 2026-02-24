import { CheckupList } from '../components/checkup/CheckupList';
import { PageLayout } from '../components/layout/PageLayout';

export function Checkups() {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <CheckupList />
      </div>
    </PageLayout>
  );
}
