import { useState, useEffect } from 'preact/hooks';
import { navigate } from '../../lib/navigate';
import { db } from '../../lib/db';
import { CheckupCard } from './CheckupCard';
import { Button } from '../shared/Button';
import { Toast } from '../shared/Toast';
import { ClipboardList } from 'lucide-preact';
import type { Checkup } from '../../types/checkup';

export function CheckupList() {
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadCheckups();
  }, []);

  const loadCheckups = async () => {
    try {
      const allCheckups = await db.checkups
        .orderBy('date')
        .toArray();

      setCheckups(allCheckups);
    } catch (error) {
      console.error('Failed to load checkups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/checkups/new');
  };

  const handleEdit = (checkup: Checkup) => {
    navigate(`/checkups/edit/${checkup.id}`);
  };

  const handleDelete = async (checkup: Checkup) => {
    if (!checkup.id) return;

    const confirmed = confirm('确定要删除这条产检记录吗？');
    if (!confirmed) return;

    try {
      await db.checkups.delete(checkup.id);
      showMessage('产检已删除');
      loadCheckups();
    } catch (error) {
      console.error('Failed to delete checkup:', error);
      showMessage('删除失败，请重试');
    }
  };

  const handleToggleComplete = async (checkup: Checkup) => {
    if (!checkup.id) return;

    try {
      await db.checkups.update(checkup.id, { completed: !checkup.completed });
      loadCheckups();
    } catch (error) {
      console.error('Failed to update checkup:', error);
    }
  };

  const showMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Separate checkups into upcoming and past
  const now = new Date();
  const upcomingCheckups = checkups.filter(
    (c) => new Date(c.date) > now || !c.completed
  );
  const pastCheckups = checkups.filter(
    (c) => new Date(c.date) <= now && c.completed
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">产检提醒</h2>
        <Button onClick={handleAdd} size="sm">
          + 添加
        </Button>
      </div>

      {/* Empty state */}
      {checkups.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4"><ClipboardList size={48} className="text-text-secondary" /></div>
          <p className="text-text-secondary mb-4">还没有产检记录</p>
          <Button onClick={handleAdd} variant="primary">
            添加第一次产检
          </Button>
        </div>
      )}

      {/* Upcoming checkups */}
      {upcomingCheckups.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-text-primary mb-3">待产检</h3>
          <div className="space-y-3">
            {upcomingCheckups.map((checkup) => (
              <CheckupCard
                key={checkup.id}
                checkup={checkup}
                onEdit={() => handleEdit(checkup)}
                onDelete={() => handleDelete(checkup)}
                onToggleComplete={() => handleToggleComplete(checkup)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past checkups */}
      {pastCheckups.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-3">已完成</h3>
          <div className="space-y-3 opacity-60">
            {pastCheckups.map((checkup) => (
              <CheckupCard
                key={checkup.id}
                checkup={checkup}
                onEdit={() => handleEdit(checkup)}
                onDelete={() => handleDelete(checkup)}
                onToggleComplete={() => handleToggleComplete(checkup)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
