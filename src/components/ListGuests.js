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
            .then(data => {
                setGuests(data);
                console.log("데이터 갱신:", data);
            })
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
        if(window.confirm("삭제하시겠습니까?")) {
            fetch(`${API_URL}/${guestId}`, { method: 'DELETE' })
                .then(() => getAllGuests())
                .catch(error => console.log(error));
        }
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{fontWeight: "bold", color: "#2c3e50"}}>🏢 사내 회의실 예약 현황</h2>
                <Link to="/add-guest" className="btn btn-primary btn-lg">+ 회의실 예약하기</Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead style={{backgroundColor: "#f8f9fa"}}>
                            <tr>
                                <th>No.</th>
                                <th>신청자 (부서)</th>
                                <th>인원</th>
                                <th>회의실</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    
                                    {/* 💡 백엔드 변수명에 맞춰서 보여줍니다 */}
                                    <td>{guest.name}</td>       {/* 신청자 정보 */}
                                    <td>{guest.num}명</td>      {/* 인원수 */}
                                    <td style={{fontWeight: "bold", color: "#0056b3"}}>
                                        {guest.phoneNum}        {/* 회의실 이름 */}
                                    </td>
                                    
                                    <td>
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
