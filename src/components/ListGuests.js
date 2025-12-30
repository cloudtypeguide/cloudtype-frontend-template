import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    // [중요] 환경변수에서 백엔드 주소 가져오기 (없으면 로컬호스트)
    // Cloudtype 환경변수 설정에서 도메인(https://...)을 입력해야 합니다.
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    const API_URL = `${BASE_URL}/api/guests`;

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGuests(data);
                console.log("📅 회의실 예약 데이터 갱신됨:", data);
            })
            .catch(error => console.error("데이터 로딩 실패:", error));
    };

    useEffect(() => {
        getAllGuests();

        // [핵심 기능] AI(MCP)가 예약을 잡고 "새로고침해!"라고 신호를 보내면 작동
        const handleMessage = (event) => {
            if (event.data?.type === 'refresh_ui') {
                console.log("🤖 AI 에이전트가 예약을 완료했습니다. 화면을 갱신합니다.");
                getAllGuests();
            }
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
        <div className="container" style={{marginTop: "50px"}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{fontWeight: "bold", color: "#2c3e50"}}>🏢 사내 회의실 예약 현황</h2>
                <Link to="/add-guest" className="btn btn-primary btn-lg">
                    + 회의실 예약하기
                </Link>
            </div>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead style={{backgroundColor: "#f8f9fa"}}>
                            <tr>
                                <th>No.</th>
                                <th>부서명</th>
                                <th>신청자</th>
                                <th>참석 인원</th>
                                <th>회의실 및 시간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    <td>{guest.firstName}</td> {/* 부서명으로 사용 */}
                                    <td>{guest.lastName}</td>  {/* 신청자명으로 사용 */}
                                    <td>{guest.emailId}명</td> {/* 인원수로 사용 */}
                                    <td style={{fontWeight: "bold", color: "#0056b3"}}>
                                        {guest.phone} {/* 회의실+시간 정보 표시 */}
                                    </td>
                                    <td>
                                        <Link className="btn btn-sm btn-outline-info me-2" to={`/edit-guest/${guest.id}`} style={{marginRight:"5px"}}>수정</Link>
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
