import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListGuests = () => {
    // 실제 백엔드 API 주소 (본인의 스프링 서버 주소로 변경 필요할 수 있음)
    // package.json의 proxy 설정을 따르거나, 전체 URL 입력
    const API_URL = "/api/guests"; // 혹은 "http://localhost:8080/api/guests"

    const [guests, setGuests] = useState([]);

    const getAllGuests = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                setGuests(data);
                console.log("데이터 갱신됨:", data);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        getAllGuests();

        // [핵심] ChatGPT(MCP)가 "예약 완료했어! 화면 갱신해!"라고 신호를 보내면 듣는 부분
        const handleMessage = (event) => {
            if (event.data?.type === 'refresh_ui') {
                console.log("🤖 AI가 예약을 추가했습니다. 목록을 갱신합니다.");
                getAllGuests();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const deleteGuest = (guestId) => {
        fetch(`${API_URL}/${guestId}`, { method: 'DELETE' }) // 백엔드 API에 맞게 수정
            .then(() => getAllGuests())
            .catch(error => console.log(error));
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <h2 className="text-center" style={{fontWeight: "bold", color: "#333"}}>🏢 사내 회의실 예약 현황</h2>
            <div className="row" style={{marginBottom: "20px"}}>
                <Link to="/add-guest" className="btn btn-primary">
                    + 회의실 수동 예약
                </Link>
            </div>
            <table className="table table-bordered table-striped">
                <thead style={{backgroundColor: "#f8f9fa"}}>
                    <tr>
                        <th>예약 번호</th>
                        <th>신청 사원명</th>
                        <th>참석 인원</th>
                        {/* 백엔드의 phone 필드를 '장소 및 시간'으로 보여줌 */}
                        <th>회의실 / 시간</th> 
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map(guest => (
                        <tr key={guest.id}>
                            <td>{guest.id}</td>
                            <td>{guest.firstName} {guest.lastName}</td>
                            <td>{guest.emailId}명</td> {/* 백엔드 변수명이 emailId나 count 등일 수 있음. 확인 필요 */}
                            <td style={{fontWeight: "bold", color: "#0056b3"}}>
                                {guest.phone} {/* 여기에 "대회의실 (15:00)" 같은 값이 들어옴 */}
                            </td>
                            <td>
                                <Link className="btn btn-info" to={`/edit-guest/${guest.id}`} style={{marginRight:"10px"}}>수정</Link>
                                <button className="btn btn-danger" onClick={() => deleteGuest(guest.id)}>취소</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListGuests;
