import ReminderForm from "./ReminderForm";
import { useState } from "react";
const ReminderBanner = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div class="offer-container">
        <div class="offer-text">
            <h2>Save the date(s). Get £5.</h2>
            <p>Add 3 occasion reminders to unlock £5 credit. And we’ll send you a friendly nudge when they’re coming up, too.</p>
        </div>
        <button class="reminder-button" onClick={() => setShowModal(true)}>Add a reminder</button>
        {showModal && <ReminderForm onClose={() => setShowModal(false)} />}
    </div>
    );
  };
  
  export default ReminderBanner;
  