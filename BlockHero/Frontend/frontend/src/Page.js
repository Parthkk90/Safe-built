import React from 'react';

function Page({ logs }) {
    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>로그 기록</h2>
            {logs.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {logs.map((log, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '10px',
                                padding: '10px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '5px',
                            }}
                        >
                            <strong>{log.user}</strong>님이{' '}
                            <strong>{log.fileName}</strong> 파일을{' '}
                            {log.action === 'uploaded' ? '업로드했습니다' : '읽었습니다'}. <br />
                            <small style={{ color: '#888' }}>{log.timestamp}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>로그가 없습니다.</p>
            )}
        </div>
    );
}

export default Page;
