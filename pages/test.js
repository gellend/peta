import useAppStore from "../src/store/global";

export default function Test() {
  const { isLoading, setIsLoading, handleOpenSnackBar } = useAppStore(
    (state) => state
  );

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
    </>
  );
}
