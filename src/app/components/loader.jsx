import styles from "./Loader.module.scss"; // You can use CSS for styling

export function Loader({ progress }) {
  const getCurrentFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const formattedDate = getCurrentFormattedDate();

  return (
    <div className={styles.loaderContainer}>
      <div className={`container ${styles.container}`}>
        <div className="row">
          <table>
            <tbody>
              <tr>
                <td>www.maxime-eloir.fr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Cores</p>
                </td>
                <td>
                  <p>:12</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>RAM</p>
                </td>
                <td>
                  <p>:At Least 8Gib</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Storage Quota</p>
                </td>
                <td>
                  <p>:834252934B</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Storage Usage</p>
                </td>
                <td>
                  <p>:4235234523B (100%)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Time spent creating this file</p>
                </td>
                <td>
                  <p>12</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Bandwidth Max</p>
                </td>
                <td>
                  <p>:At Least 8Gib</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Amount of pixels moved</p>
                </td>
                <td>
                  <p>:834252934B</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <table>
            <tbody>
              <tr>
                <td>Current Date Time</td>
                <td>:{formattedDate}</td>
              </tr>
              <tr>
                <td>Timezone</td>
                <td>:Europe</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-12">
            <div id={styles.progressBar}>
              <div
                id={styles.progressFill}
                style={{ width: `${progress}%` }} // Use inline style to set width dynamically
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
