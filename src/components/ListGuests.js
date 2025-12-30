import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error(`통신 오류! (${response.status})`);
                return response.json();
            })
            .then(data => setGuests(data))
            .catch(error => console.error("로딩 실패:", error));
    };

    useEffect(() => {
        getAllGuests();
        const handleMessage = (event) => {
            if (event.data?.type === 'refresh_ui') getAllGuests();
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const deleteGuest = (guestId) => {
        if(window.confirm("정말 예약을 취소하시겠습니까?")) {
            fetch(`${API_URL}/${guestId}`, { method: 'DELETE' })
                .then(() => getAllGuests())
                .catch(error => console.log(error));
        }
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 className="fw-bold mb-1">예약 현황</h2>
                    <p className="text-muted mb-0">현재 예약된 회의실 일정을 확인하세요.</p>
                </div>
                <Link to="/add-guest" className="btn btn-primary px-4">
                    <i className="bi bi-plus-lg me-2"></i>새 예약
                </Link>
            </div>
            
            <div className="card shadow-lg overflow-hidden border-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="bg-light bg-opacity-10">
                            <tr>
                                <th className="ps-4 py-3">부서</th>
                                <th className="py-3">예약자</th>
                                <th className="py-3">회의실</th>
                                <th className="py-3">일시</th>
                                <th className="text-end pe-4 py-3">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td className="ps-4 fw-bold">{guest.deptName}</td>
                                    <td>{guest.bookerName}</td> 
                                    <td>
                                        <span className="badge bg-primary bg-opacity-25 text-primary fw-normal px-3 py-2 rounded-pill border border-primary border-opacity-25">
                                            {guest.roomName}
                                        </span>
                                    </td>
                                    <td className="text-muted small">{guest.timeInfo}</td>
                                    <td className="text-end pe-4">
                                        <Link className="btn btn-sm btn-outline-secondary me-2" to={`/edit-guest/${guest.id}`}>수정</Link>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteGuest(guest.id)}>취소</button>
                                    </td>
                                </tr>
                            ))}
                            {guests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        현재 예약된 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListGuests;
