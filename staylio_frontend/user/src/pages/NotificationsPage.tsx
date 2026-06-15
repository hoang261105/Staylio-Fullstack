import Header from "../layout/Header";
import Footer from "../layout/Footer";
import NotificationsView from "../../../common/components/NotificationsView";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <div className="flex-1 pt-24 pb-12">
        <NotificationsView />
      </div>
      <Footer />
    </div>
  );
}
