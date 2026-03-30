import api from "../api/client";

export default function useDownloadReport() {
  async function download(path, fileName, contentType) {
    const response = await api.get(path, { responseType: "blob" });
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return { download };
}
