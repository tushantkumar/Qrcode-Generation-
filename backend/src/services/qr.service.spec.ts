import QRCode from 'qrcode';

describe('QRCode dependency', () => {
  it('generates a data URL', async () => {
    const dataUrl = await QRCode.toDataURL('registration:test');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
});
