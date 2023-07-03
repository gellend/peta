import useAppStore from "../src/store/global";

export default function Test() {
  const { isLoading, setIsLoading } = useAppStore((state) => state);

  return (
    <div>
      <h1>is Loading? {isLoading.toString()}</h1>
      <button onClick={() => setIsLoading(!isLoading)}>Klik</button>
    </div>
  );
}
