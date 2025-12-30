import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    // 1. 사용자님이 설정한 환경변수명으로 정확히 변경!
    const ENV_URL = process.env.REACT_APP_WAITLIST_API_URL;

    // 2. 환경변수가 있으면 그걸 그대로 쓰고, 없으면 로컬호스트 사용
    // (사용자님 값에 이미 '/api/guests'가 들어있으므로 뒤에 추가하지 않음)
    const API_URL = ENV_URL || "http://localhost:8080/api/guests";

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        // [디버깅] F12 콘솔에서 이 로그를 확인하세요!
        console.log("🔍 [환경변수 값 확인] REACT_APP_WAITLIST_API_URL =", ENV_URL);
        console.log("🌐 [최종 요청 주소] API_URL =", API_URL);

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`통신 오류! 상태코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setGuests(data);
                console.log("📅 데이터 갱신됨:", data);
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
                                <th>참석 인원</th>
                                <th>회의실 및 시간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest.id}>
                                    <td>{guest.id}</td>
                                    <td>{guest.firstName}</td>
                                    <td>{guest.lastName}</td> 
                                    <td>{guest.emailId}명</td>
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
