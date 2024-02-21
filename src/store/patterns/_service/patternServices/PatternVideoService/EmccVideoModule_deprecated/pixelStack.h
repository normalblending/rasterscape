
extern "C" class PixelsStack {
public:
    int width;
    int height;
    int depth;
    int oneFrameLength;
    int dataLength;

    unsigned char *data;
    int pushSide;
    int edgeMode;

    int queueOffset = 0;

    PixelsStack();

    void init(int _width, int _height, int _depth, int _pushSide, int _edgeMode);

    void setPushSide(int _pushSide);

    void setEdgeMode(int _mode);

    void setDepth(int newDepth);

    unsigned char *getPixel(int x, int y, double zNormalized);

    void push(unsigned char *pixels);
};
