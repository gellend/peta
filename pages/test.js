import CustomSnackbar from "../src/components/CustomSnackbar";
import useAppStore from "../src/store/global";

export default function Test() {
  const {
    isLoading,
    setIsLoading,
    snackbarData,
    handleOpenSnackBar,
    handleCloseSnackBar,
  } = useAppStore((state) => state);

  return (
    <>
      <div>
        <h1>is Loading? {isLoading.toString()}</h1>
        <button onClick={() => setIsLoading(!isLoading)}>Klik</button>
        <br />
        <button onClick={() => handleOpenSnackBar("Halo", "success")}>
          Open CustomSnackbar With Type
        </button>
        <br />
        <button onClick={() => handleOpenSnackBar("Halo")}>
          Open CustomSnackbar Without Type
        </button>
      </div>
      <CustomSnackbar
        open={snackbarData.open}
        message={snackbarData.message}
        type={snackbarData.type}
        onClose={() => handleCloseSnackBar()}
      />
    </>
  );
}
