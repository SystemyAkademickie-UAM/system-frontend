import StudentProfileViewContent from '../../../content/group-student-profile/StudentProfileViewContent.jsx';
import '../layouts/GroupMainLayout.css';

export default function StudentProfileViewPage() {
  return (
    <div className="group-main-layout group-main-layout--no-sub-nav">
      <StudentProfileViewContent />
    </div>
  );
}
