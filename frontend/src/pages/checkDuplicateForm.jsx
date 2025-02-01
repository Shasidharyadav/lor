import { useState, useEffect } from 'react';
import { getStudentRequests } from '../services/api';

export function useCheckDuplicateForm(teacher_id, student_id) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const allRequests = await getStudentRequests(student_id);
                setRequests(allRequests);
            } catch (error) {
                console.error('Error fetching LoR requests:', error);
                alert('Failed to fetch LoR requests.');
            } finally {
                setLoading(false);
            }
        };

        if (student_id) {
            loadRequests();
        }
    }, [student_id]);

    const checkDuplicate = () => {
        return requests.some(request =>
            request.teacher_id === teacher_id &&
            request.status !== 'EXPIRED' &&
            request.status !== 'FINISHED'
        );
    };

    return { checkDuplicate, loading };
}
