import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    // 🔴 [수정] 환경변수고 뭐고 다 필요 없고, 작동하는 주소를 직접 넣습니다.
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        console.log("🌐 요청 보내는 중:", API_URL); // F12 콘솔 확인용

        fetch(API_URL)
            .then(response => {
                // 응답이 왔는데 에러(500, 404 등)인 경우
                if (!response.ok) {
                    throw new Error(`서버 응답 에러! 상태코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setGuests(data);
                console.log("📅 데이터 갱신 성공:", data);
            })
            .catch(error => console.error("데이터 로딩 실패:", error));
    };

    useEffect(() => {
        getAllGuests();

        const handleMessage = (event) => {
            if (event.data?.type === 'refresh_ui') {
                console.log("🤖 AI 요청으로 화면 갱신");
                getAllGuests();
            }
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
                <h2 style={{fontWeight: "bold", color: "#2c3e50"}}>🏢 사내 회의실 예약 현황</h2>
                <Link to="/add-guest" className="btn btn-primary btn-lg">+ 회의실 예약하기</Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead style={{backgroundColor: "#f8f9fa"}}>
                            <tr>
                                <th>No.</th>
                                <th>부서명</th>
                                <th>신청자</th>
                                <th>인원</th>
                                <th>회의실/시간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    <td>{guest.firstName}</td>
                                    <td>{guest.lastName}</td> 
                                    <td>{guest.emailId}</td>
                                    <td style={{fontWeight: "bold", color: "#0056b3"}}>{guest.phone}</td>
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
