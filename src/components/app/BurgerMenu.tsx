export default function BurgerMenu({ ...props }) {
    return (
        <div className="flex flex-col h-6 w-8 justify-around items-center select-none cursor-pointer">
            <div className="h-1 w-full bg-gray-500" />
            <div className="h-1 w-full bg-gray-700" />
            <div className="h-1 w-full bg-gray-500" />
        </div>
    );
}
