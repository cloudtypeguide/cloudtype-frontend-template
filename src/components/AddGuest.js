import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const AddGuest = () => {
    // 🏢 마스터 데이터: 회의실 목록 및 정원
    const ROOMS = [
        { name: "Focus Room", capacity: 4 },
        { name: "Creative Lab", capacity: 8 },
        { name: "Board Room", capacity: 20 }
    ];

    // URL 파라미터(?key=value)를 읽어오는 훅(Hook)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();

    // 🔴 [백엔드 주소]
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    // 1. 상태(State) 초기화: URL에 값이 있으면 그걸 쓰고, 없으면 빈칸
    const [deptName, setDeptName] = useState(searchParams.get('dept') || '');   
    const [bookerName, setBookerName] = useState(searchParams.get('booker') || ''); 
    const [timeInfo, setTimeInfo] = useState(searchParams.get('time') || '');
    
    // 방 선택 초기값: URL에 있으면 그 방, 없으면 첫 번째 방
    const initialRoom = searchParams.get('room') || ROOMS[0].name;
    const [selectedRoom, setSelectedRoom] = useState(initialRoom);


    const saveOrUpdateGuest = (e) => {
        e.preventDefault();

        // 백엔드(Guest.java) 변수명과 100% 일치시킴
        const guest = { 
            deptName: deptName,
            bookerName: bookerName,
            roomName: selectedRoom,
            timeInfo: timeInfo
        };

        console.log("🌐 전송 데이터:", guest);

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        fetch(url, requestOptions)
            .then(response => {
                if(!response.ok) throw new Error(`Server Error (${response.status})`);
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 회의실 예약이 확정되었습니다.");
                navigate('/');
            })
            .catch(error => {
                console.error("실패:", error);
                alert(`저장 실패!\n${error.message}`);
            });
    }

    // 수정 모드일 때 데이터 불러오기
    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setDeptName(data.deptName);
                    setBookerName(data.bookerName);
                    setSelectedRoom(data.roomName);
                    setTimeInfo(data.timeInfo);
                })
                .catch(error => console.log(error));
        }
    }, [id]);

    const title = () => {
        return id ? <h2 className="text-center mb-4">예약 수정</h2> : <h2 className="text-center mb-4">회의실 예약</h2>
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <div className="row">
                <div className="card col-md-6 offset-md-3 shadow">
                    <div className="card-body">
                        {title()}
                        <form>
                            {/* 1. 부서명 */}
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 부서명 </label>
                                <input type="text" placeholder="예: 개발팀" className="form-control" 
                                       value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                            </div>

                            {/* 2. 예약자명 */}
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 예약자 성함 </label>
                                <input type="text" placeholder="예: 홍길동" className="form-control" 
                                       value={bookerName} onChange={(e) => setBookerName(e.target.value)} />
                            </div>

                            {/* 3. 회의실 선택 (셀렉터) */}
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 회의실 선택 </label>
                                <select className="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                                    {ROOMS.map(room => (
                                        <option key={room.name} value={room.name}>
                                            {room.name} (정원: {room.capacity}명)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. 시간 정보 */}
                            <div className="form-group mb-4">
                                <label className="form-label fw-bold"> 사용 시간 </label>
                                <input type="text" placeholder="예: 14:00 ~ 16:00" className="form-control" 
                                       value={timeInfo} onChange={(e) => setTimeInfo(e.target.value)} />
                            </div>

                            <button className="btn btn-success" onClick={(e) => saveOrUpdateGuest(e)}>저장하기</button>
                            <Link to="/" className="btn btn-secondary ms-2">취소</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;
