
export default function ResumePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <iframe
        src="/keshav-resume.pdf"
        style={{ flex: 1, border: 'none' }}
        title="Keshav's Resume"
      />
    </div>
  );
}
