import { Search } from "lucide-react";

export const SearchInput = () => {
	return (
		<form className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search…'
				className='input-sm md:input input-bordered rounded-full sm:rounded-full w-full'
			/>
			<button type='submit' className='btn md:btn-md btn-sm btn-circle bg-green-500 text-white hover:bg-stone-900 '>
				<Search className='w-4 h-4 md:w-6 md:h-6 outline-none' />
			</button>
		</form>
	);
};