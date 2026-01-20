import { useState } from 'react';
import { useModal } from '../context/ModalContext';
import './RegisterModal.css';

export function RegisterModal() {
    const { isRegisterModalOpen, closeRegisterModal, registerFile } = useModal();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isRegisterModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/marketing/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok && response.status !== 200) {
                setError(data.error || 'Something went wrong. Please try again.');
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            setIsSuccess(true);
        } catch (err) {
            setError('Unable to connect. Please try again later.');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setIsSuccess(false);
        setError('');
        closeRegisterModal();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>&times;</button>

                {isSuccess ? (
                    <div className="success-message">
                        <div className="success-icon">&#10003;</div>
                        <h3 className="success-title">You're on the list!</h3>
                        <p className="success-text">
                            We'll notify you as soon as Enrich is ready for you.
                        </p>
                        <button className="form-button" onClick={handleClose}>
                            Got it
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="modal-title">Join the Waitlist</h2>
                        <p className="modal-description">
                            {registerFile
                                ? `We'll process "${registerFile.name}" and notify you when ready.`
                                : 'Be the first to know when Enrich launches. Get early access and exclusive pricing.'}
                        </p>

                        <form className="modal-form" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button
                                type="submit"
                                className="form-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
