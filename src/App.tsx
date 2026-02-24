import { Router, Route } from 'preact-router';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { Movement } from './pages/Movement';
import { MovementCount } from './pages/MovementCount';
import { Checkups } from './pages/Checkups';
import { CheckupEdit } from './pages/CheckupEdit';
import { Settings } from './pages/Settings';
import { ProfileEdit } from './pages/ProfileEdit';
import { Onboarding } from './pages/Onboarding';
import { isOnboarded } from './stores/userStore';
import { handleRouteChange } from './stores/routerStore';

export function App() {
  const onboarded = isOnboarded.value;

  // 如果未引导，只显示欢迎页面
  if (!onboarded) {
    return <Onboarding />;
  }

  return (
    <AppShell>
      <Router onChange={(e) => handleRouteChange(e.url)}>
        <Route path="/" component={Home} />
        <Route path="/movement" component={Movement} />
        <Route path="/movement/count" component={MovementCount} />
        <Route path="/checkups" component={Checkups} />
        <Route path="/checkups/new" component={CheckupEdit} />
        <Route path="/checkups/edit/:id" component={CheckupEdit} />
        <Route path="/settings" component={Settings} />
        <Route path="/settings/edit" component={ProfileEdit} />
      </Router>
    </AppShell>
  );
}
