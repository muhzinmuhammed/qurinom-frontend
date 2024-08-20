import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useGetMyPostDataQuery, usePostDataMutation, useUpdatePostDataMutation, useDeletePostDataMutation } from '../../features/api/postAPI/postApi';

const Post = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const { data, refetch } = useGetMyPostDataQuery(userId);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const [postData] = usePostDataMutation();
  const [updatePostData] = useUpdatePostDataMutation();
  const [deletePostData] = useDeletePostDataMutation();

  function closeModal() {
    setIsOpen(false);
    setEditingPost(null);
    setTitle('');
    setContent('');
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false);
    setDeletingPostId(null);
  }

  function openModal(post = null) {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
    }
    setIsOpen(true);
  }

  function openDeleteModal(postId) {
    setDeletingPostId(postId);
    setIsDeleteOpen(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postPayload = {
      title,
      content,
      userId,
    };

    if (editingPost) {
      // Update the post
      const response = await updatePostData({ _id: editingPost?._id, ...postPayload }).unwrap();
      console.log('Updated post:', response);
    } else {
      // Create a new post
      const response = await postData(postPayload).unwrap();
      console.log('Created post:', response);
    }

    closeModal();
    refetch(); // Refetch posts after adding or updating
  };

  const handleDelete = async () => {
    try {
      await deletePostData(deletingPostId).unwrap();
      console.log('Post deleted successfully');
      refetch(); // Refetch posts after deletion
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right mt-5"
        onClick={() => openModal()}
      >
        Add Post
      </button>
      <div className="flex flex-wrap justify-center gap-4 mt-28 p-4">
        {data?.data?.map((card) => (
          <div key={card._id} className="max-w-xs rounded overflow-hidden shadow-lg">
            <img
              className="w-full"
              src="https://qurinomsolutions.com/wp-content/uploads/2021/03/Group-11.png"
              alt={card.title}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Title: {card?.title}</div>
              <p className="text-gray-700 text-base">Description: {card?.content}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openModal(card)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openDeleteModal(card._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Post Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {editingPost ? 'Edit Post' : 'Add New Post'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                        Content
                      </label>
                      <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        {editingPost ? 'Update Post' : 'Add Post'}
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Are you sure you want to delete this post? This action cannot be undone.</p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Post;
