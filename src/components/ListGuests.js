import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    // 🔴 [백엔드 주소]
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error(`통신 오류! (${response.status})`);
                return response.json();
            })
            .then(data => {
                setGuests(data);
            })
            .catch(error => console.error("로딩 실패:", error));
    };

    useEffect(() => {
        getAllGuests();
        // MCP에서 "새로고침해!" 신호를 보내면 작동
        const handleMessage = (event) => {
            if (event.data?.type === 'refresh_ui') getAllGuests();
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const deleteGuest = (guestId) => {
        if(window.confirm("예약을 취소하시겠습니까?")) {
            fetch(`${API_URL}/${guestId}`, { method: 'DELETE' })
                .then(() => getAllGuests())
                .catch(error => console.log(error));
        }
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{fontWeight: "bold", color: "#2c3e50"}}>🏢 회의실 예약 현황</h2>
                <Link to="/add-guest" className="btn btn-primary btn-lg">+ 예약하기</Link>
            </div>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead style={{backgroundColor: "#f8f9fa"}}>
                            <tr>
                                <th>No.</th>
                                <th>부서</th>
                                <th>예약자</th>
                                <th>회의실</th>
                                <th>시간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    <td>{guest.deptName}</td>
                                    <td>{guest.bookerName}</td> 
                                    <td style={{fontWeight: "bold", color: "#0056b3"}}>
                                        {guest.roomName}
                                    </td>
                                    <td>{guest.timeInfo}</td>
                                    <td>
                                        <Link className="btn btn-sm btn-outline-info me-2" to={`/edit-guest/${guest.id}`}>수정</Link>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteGuest(guest.id)}>취소</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListGuests;
